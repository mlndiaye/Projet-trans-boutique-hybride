# models.py
from django.db import models
from django.urls import reverse
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image
from users.models import UserModel

from django.conf import settings

STATUS_CHOICE = (
    ("process", "Processing"),
    ("shipped", "Shipped"),
    ("delivered", "Delivered")
)

class Category(models.Model):
    id_category = models.AutoField(primary_key=True)
    name_category = models.CharField(max_length=100)
    img_category = models.ImageField(upload_to='categories', default='img-category')
    description = models.TextField()

    def __str__(self) -> str:
        return self.name_category

class Product(models.Model):
    id_product = models.AutoField(primary_key=True)
    name_product = models.CharField(max_length=100)
    description = models.TextField()
    price_product = models.DecimalField(max_digits=17, decimal_places=2)
    stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    qr_code = models.ImageField(upload_to='products/qr_codes/', blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name_product

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.generate_qr_code()

    def generate_qr_code(self):
        product_url = settings.BASE_URL + reverse('product_detail', args=[self.id_product])
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(product_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        self.qr_code.save(f'qr_code_{self.id_product}.png', File(buffer), save=False)
        self.save()


class Image(models.Model):
    id_img = models.AutoField(primary_key=True)
    src_img = models.ImageField(upload_to='products/')
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)

class CartOrder(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="orders")
    price = models.DecimalField(max_digits=9999999999999, decimal_places=2, default="1.99")
    paid_status = models.BooleanField(default=False)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(choices=STATUS_CHOICE, max_length=30, default="processing")

    class Meta:
        verbose_name_plural = "Cart Order"

class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(default=0)
    total = models.DecimalField(max_digits=9999999999999, decimal_places=2, default="1.99")

    class Meta:
        verbose_name_plural = "Cart Order Item"

class Wishlist(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'wishlists'
        unique_together = ('user', 'product')
    
    def __str__(self) -> str:
        return self.product.name_product