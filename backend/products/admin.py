from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse
from .models import Product, Category, Image



class ImageInline(admin.TabularInline):
    model = Image
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ImageInline]
    list_display = ['name_product', 'price_product', 'stock', 'category']
    list_filter = ['category']
    search_fields = ['name_product', 'description']

    def response_add(self, request, obj, post_url_continue=None):
        """
        Rediriger vers le QR code après l'ajout d'un nouveau produit
        """
        if '_addanother' not in request.POST and '_continue' not in request.POST:
            return redirect('product_qr_code', product_id=obj.id_product)
        return super().response_add(request, obj, post_url_continue)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name_category', 'description']

admin.site.register(Image)