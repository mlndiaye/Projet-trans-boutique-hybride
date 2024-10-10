# views.py
from django.db.models import Sum
from rest_framework import status
from rest_framework.views import APIView
from .serializers import CategorySerializer
from .models import  Category
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F

class CategoryAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            # Récupérer une catégorie spécifique
            try:
                category = Category.objects.get(pk=pk)
                serializer = CategorySerializer(category)
                return Response(serializer.data)
            except Category.DoesNotExist:
                return Response({'error': 'Catégorie non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Récupérer toutes les catégories
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data)