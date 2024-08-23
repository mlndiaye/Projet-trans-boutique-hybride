# models.py
from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image

class Category(models.Model):
    id_category = models.AutoField(primary_key=True)
    name_category = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self) -> str:
        return self.name_category

class Product(models.Model):
    id_produit = models.AutoField(primary_key=True)
    name_produit = models.CharField(max_length=100)
    description = models.TextField()
    price_produit = models.DecimalField(max_digits=17, decimal_places=2)
    stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name_produit

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.generate_qr_code()

    def generate_qr_code(self):
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(f'/products/{self.id_produit}/')
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        self.qr_code.save(f'qr_code_{self.id_produit}.png', File(buffer), save=False)
        super().save()

class Image(models.Model):
    id_img = models.AutoField(primary_key=True)
    src_img = models.ImageField(upload_to='products/')
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)