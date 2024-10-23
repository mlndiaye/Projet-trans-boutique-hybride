from django.urls import path
from .views import product_detail, product_qr_code, toggle_wishlist, get_wishlist, remove_from_wishlist, clear_wishlist, search_products


urlpatterns = [
    path('<int:product_id>/', product_detail, name='product_detail'),
    path('<int:product_id>/qr-code/', product_qr_code, name='product_qr_code'),
    path('toggle-wishlist/', toggle_wishlist, name='toggle_wishlist'),
    path('get-wishlist/', get_wishlist, name='get_wishlist'),
    path('remove-from-wishlist/<int:product_id>/', remove_from_wishlist, name='remove_from_wishlist'),
    path('clear-wishlist/', clear_wishlist, name='clear_wishlist'),
]
