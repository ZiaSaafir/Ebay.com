from rest_framework import serializers
from .models import Product, Category, Cart, CartItem   # ✅ FIX: Added missing imports
from  django.contrib.auth.models import User
# ------------------ CATEGORY ------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# ------------------ PRODUCT ------------------
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


# ------------------ CART ITEM ------------------
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    product_image = serializers.ImageField(
        source='product.image',
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = '__all__'


# ------------------ CART ------------------
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()   # assumes model has a total property

    class Meta:
        model = Cart
        fields = '__all__'

from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    # ---------------- VALIDATION ----------------
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    # ---------------- CREATE USER ----------------
    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data.get('email', '')   # ✅ FIXED
        password = validated_data['password']

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        return user