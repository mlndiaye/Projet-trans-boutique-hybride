# views.py
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import ProductSerializer, CategorySerializer, LowStockProductSerializer
from .models import Product, Category
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F




class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(['GET'])
def get_dashboard_stats(request):
    # Statistiques globales
    total_products = Product.objects.count()
    total_sales = Product.objects.aggregate(Sum('sales_count'))['sales_count__sum']
    low_stock_products = Product.objects.filter(stock__lt=10).count()
    
    # Ventes par catégorie
    sales_by_category = Category.objects.annotate(
        total_sales=Sum('products__sales_count')
    ).values('name_category', 'total_sales')
    
    # Ventes mensuelles
    monthly_sales = Product.objects.annotate(
        month=TruncMonth('last_sale_date')
    ).values('month').annotate(
        sales=Sum('sales_count')
    ).order_by('month')
    
    return Response({
        'global_stats': {
            'total_products': total_products,
            'total_sales': total_sales,
            'low_stock_products': low_stock_products
        },
        'sales_by_category': list(sales_by_category),
        'monthly_sales': list(monthly_sales)
    })

class LowStockProductsView(APIView):
    def get(self, request):
        low_stock_products = Product.objects.filter(stock__lt=F('minimum_stock'))
        serializer = LowStockProductSerializer(low_stock_products, many=True)
        return Response(serializer.data)