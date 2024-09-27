from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from users.serializers import CustomUserSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# @api_view(['GET'])
# def welcome(request):
#     routes = [
#         "/gg",
#         "llkk",
#     ]
#     return Response(routes)

