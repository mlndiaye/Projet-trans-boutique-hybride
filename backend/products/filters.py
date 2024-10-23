import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    name_product = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category__name_category', lookup_expr='icontains')
    ordering = django_filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('price_product', 'price_product'),
        ),
        field_labels={
            'created_at': 'Date',
            'price_product': 'Price',
        },
        label='Sort by'
    )
    
    class Meta:
        model = Product
        fields = ['name_product', 'category', 'price_product', 'created_at']
