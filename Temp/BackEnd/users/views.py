from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, UserProfile
from .serializers import CustomUserSerializer, UserProfileSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def follow(self, request, pk=None):
        profile = self.get_object()
        user = request.user
        profile.followers.add(user)
        return Response({'status': 'followed'})

    @action(detail=True, methods=['POST'])
    def add_friend(self, request, pk=None):
        profile = self.get_object()
        user = request.user
        profile.friends.add(user)
        return Response({'status': 'friend added'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request, username=None):
    if username:
        profile = get_object_or_404(UserProfile, user__username=username)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = CustomUser.objects.all()
    serializer = CustomUserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users_with_profiles(request):
    users_with_profiles = []
    
    for user in CustomUser.objects.all():
        profile = UserProfile.objects.get(user=user)
        user_serializer = CustomUserSerializer(user)
        profile_serializer = UserProfileSerializer(profile)
        
        combined_data = {
            # **user_serializer.data,
            **profile_serializer.data
        }
        
        users_with_profiles.append(combined_data)
    
    return Response(users_with_profiles)
