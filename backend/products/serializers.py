# serializers.py
from rest_framework import serializers

from categories.serializers import CategorySerializer
from .models import Product, Category, Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id_img', 'src_img']


class ProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = Product
        fields = ['id_product', 'name_product', 'description', 'price_product', 'stock', 
                  'created_at', 'updated_at', 'qr_code', 'category', 'category_id', 'images']

    def create(self, validated_data):
        images_data = self.context.get('view').request.FILES
        produit = Product.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            Image.objects.create(produit=produit, src_img=image_data)
        return produit
    

    

class LowStockProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id_product', 'name_product', 'stock', 'minimum_stock', 'category']
        depth = 1 