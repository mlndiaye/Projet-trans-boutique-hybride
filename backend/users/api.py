from .models import UserModel
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, UserSerializer, AdminUserSerializer
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response


class RegisterView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ViewSet):
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
        
        return Response(serializer.data)
   
