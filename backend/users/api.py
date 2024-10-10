from .models import UserModel
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, UserSerializer, AdminUserSerializer, ChangePasswordSerializer
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from rest_framework.decorators import api_view, permission_classes
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponseRedirect
from django.conf import settings
from django.middleware.csrf import get_token
import jwt
from datetime import datetime, timedelta


class RegisterView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


""" class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        # Si l'utilisateur est superutilisateur, affiche tous les champs
        if request.user.is_superuser:
            users = UserModel.objects.all()
            serializer = AdminUserSerializer(users, many=True)
        else:
            # Si l'utilisateur n'est pas superutilisateur, affiche les champs restreints
            users = UserModel.objects.all()
            serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            user = UserModel.objects.get(pk=pk)
        except UserModel.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        if request.user.is_superuser:
            serializer = AdminUserSerializer(user)
        else:
            serializer = UserSerializer(user)
        
        return Response(serializer.data) """
   
# views.py

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        user_data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'address': user.address
        }
        return Response(user_data, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Important for maintaining the user session

            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

@staff_member_required
def admin_redirect_to_dashboard(request):
    # Créer un JWT token avec les infos nécessaires
    payload = {
        'user_id': request.user.id,
        'email': request.user.email,
        'is_staff': True,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token valide pour 1h
    }
    
    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm='HS256'
    )
    
    # L'URL de votre app Angular avec le token
    angular_url = f"{settings.ANGULAR_DASHBOARD_URL}?token={token}"
    
    return HttpResponseRedirect(angular_url)