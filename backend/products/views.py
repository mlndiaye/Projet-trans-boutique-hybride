# views.py
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Product, Category, CartOrder, CartOrderItem, Product
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
