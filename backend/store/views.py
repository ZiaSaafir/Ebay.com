from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from .models import Product, Category, Cart, CartItem, Order, OrderItem
from .serializer import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
    RegisterSerializer,
    UserSerializer
)

# ------------------ PRODUCTS (PUBLIC) ------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ------------------ CATEGORIES (PUBLIC) ------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# ------------------ CART (PROTECTED) ------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


# ------------------ ADD TO CART ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    cart, _ = Cart.objects.get_or_create(user=request.user)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if not created:
        item.quantity += 1
        item.save()

    return Response({'message': 'Product added to cart'})


# ------------------ REMOVE FROM CART ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')

    try:
        item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )
        item.delete()
        return Response({'message': 'Item removed from cart'})

    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Item not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ------------------ UPDATE CART ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response(
            {'error': "Item id and quantity required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )

        quantity = int(quantity)

        if quantity < 1:
            item.delete()
            return Response({'message': 'Item removed'})

        item.quantity = quantity
        item.save()

        return Response({'message': 'Quantity updated'})

    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Item not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ------------------ CREATE ORDER ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data

        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')

        # validation
        if not phone or not phone.isdigit() or len(phone) < 10:
            return Response(
                {'error': "Invalid phone number"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)

        if not cart.items.exists():
            return Response(
                {'error': "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = sum(
            item.product.price * item.quantity
            for item in cart.items.all()
        )

        order = Order.objects.create(
            user=request.user,
            total_amount=total
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )

        cart.items.all().delete()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ------------------ REGISTER ------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User created successfully",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)