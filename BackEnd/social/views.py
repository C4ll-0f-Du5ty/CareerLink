from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response
from users.models import CustomUser, UserProfile
from users.serializers import CustomUserSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
import urllib.parse
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, username):
    try:
        user = CustomUser.objects.get(username=username)
        posts = user.post_set.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def get_latest_posts(request):
    posts = Post.objects.order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    for post in serializer.data:
        user = CustomUser.objects.get(username=post['author'])
        image = urllib.parse.unquote(user.profile_image.url)
        post.update({
            'profile_image': image
        })
    return Response(serializer.data)


# @api_view(['GET'])
# def search(request):
#     query = request.query_params.get('q')
#     if (query):
#         users = CustomUser.objects.filter(username__icontains=query)
#         posts = Post.objects.filter(content__icontains=query).only('author', 'content', 'category')
#         user_serializer = CustomUserSerializer(users, many=True)
#         post_serializer = PostSerializer(posts, many=True)
#     return Response({
#         'users': user_serializer.data if query else [],
#         'posts': post_serializer.data if query else []
#         })

from django.db.models import Q
@api_view(['GET'])
def search(request):
    query = request.query_params.get('q')
    
    if query:
        # Search through users excluding id and password
        users = CustomUser.objects.filter(username__icontains=query).only('username', 'email', 'profile_image')
        
        # Search through posts by author, title, and content
        posts = Post.objects.filter(
            Q(content__icontains=query) | Q(title__icontains=query) | Q(author__username__icontains=query)
        ).select_related('author').only('author__username', 'author__profile_image', 'title', 'content', 'category')
        
        # Serialize users and posts
        user_serializer = CustomUserSerializer(users, many=True)
        post_serializer = PostSerializer(posts, many=True, context={'request': request})

        for post in post_serializer.data:
            user = CustomUser.objects.get(username=post['author'])
            image = urllib.parse.unquote(user.profile_image.url)
            post['profile_image'] = image

    return Response({
        'users': user_serializer.data if query else [],
        'posts': post_serializer.data if query else []
    })



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request, username=None):
    profile = get_object_or_404(UserProfile, user__username=username)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
