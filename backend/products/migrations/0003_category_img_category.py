# Generated by Django 5.0.8 on 2024-10-15 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_wishlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='img_category',
            field=models.ImageField(default='img-category', upload_to='categories'),
        ),
    ]