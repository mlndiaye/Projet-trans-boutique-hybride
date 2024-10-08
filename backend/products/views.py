# views.py
from .models import Product
from django.shortcuts import render, get_object_or_404






def product_detail(request, product_id):
    product = get_object_or_404(Product, id_product=product_id)
    return render(request, 'products/product_detail.html', {'product': product})

def product_qr_code(request, product_id):
    product = get_object_or_404(Product, id_product=product_id)
    return render(request, 'products/product_qr_code.html', {'product': product})

