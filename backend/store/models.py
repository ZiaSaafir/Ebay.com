from django.db import models

from django.contrib.auth.models import User

class Category(models.Model):
    name=models.CharField(max_length=100,unique=True)
    slug=models.SlugField(unique=True)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category=models.ForeignKey(Category,related_name='product',on_delete=models.CASCADE)
    name=models.CharField(max_length=100)
    description=models.TextField(blank=True)
    image=models.ImageField(upload_to='product/',blank=True,null=True)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class UserProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    phone=models.CharField(max_length=15,blank=True)
    address=models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    name = models.CharField(max_length=200, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    payment_method = models.CharField(max_length=50, default='COD')

    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
class OrderItem(models.Model):
    order=models.ForeignKey(Order,related_name='items',on_delete=models.CASCADE)
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=1)
    price=models.DecimalField(max_digits=10,decimal_places=2)

    def __str__ (self):
        return f"{self.quantity} x {self.product.name}"


class Cart(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user}"
    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())
    
class CartItem(models.Model):
    cart=models.ForeignKey(Cart,related_name='items' , on_delete=models.CASCADE)
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    @property
    def subtotal(self):
        return self.quantity*self.product.price
    

