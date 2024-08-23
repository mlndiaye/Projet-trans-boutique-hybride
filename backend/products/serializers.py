# serializers.py
from rest_framework import serializers
from .models import Product, Category, Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id_img', 'src_img']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id_category', 'name_category', 'description']

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
        fields = ['id_produit', 'name_produit', 'description', 'price_produit', 'stock', 
                  'created_at', 'updated_at', 'qr_code', 'category', 'category_id', 'images']

    def create(self, validated_data):
        images_data = self.context.get('view').request.FILES
        produit = Product.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            Image.objects.create(produit=produit, src_img=image_data)
        return produit