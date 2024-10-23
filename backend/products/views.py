# views.py
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Product, Category, CartOrder, CartOrderItem, Product, Wishlist
from .serializers import ProductSerializer, CategorySerializer
from django.shortcuts import render, get_object_or_404
from django_filters import rest_framework as filters
from .filters import ProductFilter
from django.http import JsonResponse

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ProductFilter

    @action(detail=False, methods=['get'], url_path='category/(?P<category_name>[^/]+)')
    def by_category(self, request, category_name=None):
        category = Category.objects.get(name_category = category_name)
        products = Product.objects.filter(category = category)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

""" class ProductByCategoryView(generics.ListAPIView):
    def get_queryset(self):
        category_name = self.kwargs['category']
        category = Category.objects.get(name_category = category_name)
        return Product.objects.filter(category = category)
    serializer_class = ProductSerializer """


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer



def product_detail(request, product_id):
    product = get_object_or_404(Product, id_product=product_id)
    return render(request, 'products/product_detail.html', {'product': product})

def product_qr_code(request, product_id):
    product = get_object_or_404(Product, id_product=product_id)
    return render(request, 'products/product_qr_code.html', {'product': product})




class CreateOrderView(APIView):
    # Ajouter le permission et l'authentification JWT
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            # Récupérer l'utilisateur authentifié depuis le token JWT
            user = request.user
            
            # Récupérer les autres données de la commande depuis Angular
            total_price_from_client = request.data.get('total_amount')
            items = request.data.get('order_items')
            
            # Initialiser le total calculé côté backend
            total_calculated = 0

            # Créer l'objet CartOrder (sans le prix pour l'instant)
            order = CartOrder.objects.create(
                user=user,
                price=0,  # On va mettre à jour cela après calcul
                paid_status=False,
                status="processing"
            )
            
            # Créer les CartOrderItems pour chaque item dans la commande
            for item in items:
                product_id = item.get('product_id')
                quantity = item.get('quantity')

                product = Product.objects.get(id=product_id)
                
                # Calculer le prix total pour cet article
                total_item_price = product.price_product * quantity
                
                # Ajouter au total calculé
                total_calculated += total_item_price

                # Créer l'objet CartOrderItem
                CartOrderItem.objects.create(
                    order=order,
                    item=product,
                    qty=quantity,
                    total=total_item_price
                )

            # Comparer le total calculé avec celui envoyé par le frontend
            if total_calculated != total_price_from_client:
                return Response({
                    'error': 'Le total envoyé ne correspond pas au total calculé.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Mettre à jour le prix total dans l'objet CartOrder après vérification
            order.price = total_calculated
            order.save()

            return Response({'message': 'Commande créée avec succès.'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')
    products = [item.product for item in wishlist_items]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_wishlist(request):
    product_id = request.data.get('product_id')
    user = request.user
    
    try:
        wishlist_item = Wishlist.objects.get(user=user, product_id=product_id)
        return Response({'status': 'already_in_wishlist'}, status=status.HTTP_200_OK)
    
    except Wishlist.DoesNotExist:
        Wishlist.objects.create(user=user, product_id=product_id)
        return Response({'status': 'added'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, product_id):
    user = request.user
    try:
        wishlist_item = Wishlist.objects.get(user=user, product_id=product_id)
        wishlist_item.delete()
        return Response({'status': 'removed'}, status=status.HTTP_200_OK)
    except Wishlist.DoesNotExist:
        return Response({'status': 'not_in_wishlist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_wishlist(request):
    user = request.user
    Wishlist.objects.filter(user=user).delete()
    return Response({'status': 'wishlist_cleared'}, status=status.HTTP_200_OK)



"""         Wishlist.objects.all().delete()
 """



@api_view(['GET'])
def search_products(request):
    products = Product.objects.all()
    product_filter = ProductFilter(request.GET, queryset=products)
    filtered_products = product_filter.qs

    serializer = ProductSerializer(filtered_products, many=True)
    
    return JsonResponse(serializer.data, safe=False)
