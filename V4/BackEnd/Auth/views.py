from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework import status
from users.serializers import CustomUserSerializer
from rest_framework.response import Response
from users.models import CustomUser

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        
        # Check for existing username
        if CustomUser.objects.filter(username=request.data.get('username')).exists():
            return Response({"error": "Username already exists. Please choose another one."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and save the new user
        if serializer.is_valid():
            user = serializer.save()
            print(user.username, user.password, user.email)
            return Response({"id": user.id, "username": user.username, "email": user.email}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def test(request):
    return render(request, 'test.html')
