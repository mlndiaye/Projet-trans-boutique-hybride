# views.py
from django.db.models import Sum
from rest_framework import status
from rest_framework.views import APIView
from .serializers import ProductSerializer, CategorySerializer, LowStockProductSerializer
from .models import Product, Category
from django.db.models.functions import TruncMonth, TruncDay, TruncWeek
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F



class ProductAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            # Récupérer un produit spécifique si l'ID est fourni
            try:
                product = Product.objects.get(pk=pk)
                serializer = ProductSerializer(product)
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({'error': 'Produit non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Récupérer la liste de tous les produits
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)




@api_view(['GET'])
def get_dashboard_stats(request, period='month'):
    total_products = Product.objects.count()
    total_sales = Product.objects.aggregate(Sum('sales_count'))['sales_count__sum']
    low_stock_products = Product.objects.filter(stock__lt=F('minimum_stock')).count()
    # Ajout des produits les plus consultés
    most_viewed_products = Product.objects.order_by('-views_count')[:5].values(
        'name_product',
        'views_count'
    )
    sales_by_category = Category.objects.annotate(
        total_sales=Sum('products__sales_count')
    ).values('name_category', 'total_sales')
    
    # Ventes selon la période
    if period == 'day':
        sales_data = Product.objects.annotate(
            date=TruncDay('last_sale_date')
        ).values('date').annotate(
            sales=Sum('sales_count')
        ).order_by('date')
        formatted_sales = [
            {'date': item['date'].strftime('%Y-%m-%d'), 'sales': item['sales']}
            for item in sales_data
        ]

    elif period == 'week':
        sales_data = Product.objects.annotate(
            date=TruncWeek('last_sale_date')
        ).values('date').annotate(
            sales=Sum('sales_count')
        ).order_by('date')
        formatted_sales = [
            {'date': item['date'].strftime('%Y-%m-%d'), 'sales': item['sales']}
            for item in sales_data
        ]

    else:  # month
        sales_data = Product.objects.annotate(
            date=TruncMonth('last_sale_date')
        ).values('date').annotate(
            sales=Sum('sales_count')
        ).order_by('date')
        formatted_sales = [
            {
                'month': item['date'].strftime('%B %Y'),  # Format: "Janvier 2024"
                'sales': item['sales']
            }
            for item in sales_data
        ]

    return Response({
        'global_stats': {
            'total_products': total_products,
            'total_sales': total_sales,
            'low_stock_products': low_stock_products
        },
        'sales_by_category': list(sales_by_category),
        'daily_sales': formatted_sales if period == 'day' else [],
        'weekly_sales': formatted_sales if period == 'week' else [],
        'monthly_sales': formatted_sales if period == 'month' else [],
        'most_viewed_products': list(most_viewed_products) 

    })


class LowStockProductsView(APIView):
    def get(self, request):
        low_stock_products = Product.objects.filter(stock__lt=F('minimum_stock'))
        serializer = LowStockProductSerializer(low_stock_products, many=True)
        return Response(serializer.data)
    

class SalesDetailsView(APIView):
    def get(self, request):
        # Récupérer uniquement les produits qui ont des ventes
        products_with_sales = Product.objects.filter(
            sales_count__gt=0
        ).select_related('category').order_by('-last_sale_date')

        # Formatter les données pour l'affichage
        sales_details = []
        for product in products_with_sales:
            sales_details.append({
                'product_id': product.id_product,
                'product_name': product.name_product,
                'category_name': product.category.name_category,
                'quantity_sold': product.sales_count,
                'unit_price': product.price_product,
                'total_sales': product.sales_count * product.price_product,
                'last_sale_date': product.last_sale_date
            })

        return Response(sales_details)