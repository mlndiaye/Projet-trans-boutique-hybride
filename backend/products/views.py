# views.py
from rest_framework import viewsets
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from django.shortcuts import render, get_object_or_404


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer



def product_detail(request, product_id):
    product = get_object_or_404(Product, id_product=product_id)
    return render(request, 'products/product_detail.html', {'product': product})

def product_qr_code(request, product_id):
    product = get_object_or_404(Product, id_product=product_id)
    return render(request, 'products/product_qr_code.html', {'product': product})