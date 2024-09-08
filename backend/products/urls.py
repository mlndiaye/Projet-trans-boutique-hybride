from django.urls import path
from .views import product_detail, product_qr_code


urlpatterns = [
    path('<int:product_id>/', product_detail, name='product_detail'),
    path('<int:product_id>/qr-code/', product_qr_code, name='product_qr_code'),

]