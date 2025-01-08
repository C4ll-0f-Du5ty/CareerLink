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
from django.db.models import Q
from django.http import JsonResponse
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, username):
    try:
        user = CustomUser.objects.get(username=username)
        posts = user.post_set.all()
        serializer = PostSerializer(posts, many=True)
        for post in serializer.data:
            user = CustomUser.objects.get(username=post['author'])
            image = urllib.parse.unquote(user.profile_image.url)
            post.update({
                'profile_image': image
            })
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_with_posts(request, username=None):
    try:
        if username:
            profile = get_object_or_404(UserProfile, user__username=username)
            serializer = UserProfileSerializer(profile)

            # Determine if the current user is a friend
            is_friend = profile.friends.filter(id=request.user.id).exists()

            # Fetch posts
            posts = profile.user.post_set.all()
            posts_serializer = PostSerializer(posts, many=True)

            for post in posts_serializer.data:
                user = CustomUser.objects.get(username=post['author'])
                post.update({
                    'profile_image': urllib.parse.unquote(user.profile_image.url),
                })

            return Response({
                "profile": serializer.data,
                "is_friend": is_friend,
                "posts": posts_serializer.data,
            }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




@api_view(['GET'])
def get_latest_posts(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    for post in serializer.data:
        user = CustomUser.objects.get(username=post['author'])
        image = urllib.parse.unquote(user.profile_image.url)
        post.update({
            'profile_image': image
        })
    return Response(serializer.data)

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



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)

        # Check if the user is the author of the post
        if post.author != request.user:
            return JsonResponse({'detail': 'Not authorized to edit this post.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Post.DoesNotExist:
        return JsonResponse({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)

        # Check if the user is the author of the post
        if post.author != request.user:
            return JsonResponse({'detail': 'Not authorized to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return JsonResponse({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    except Post.DoesNotExist:
        return JsonResponse({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            liked = False
        else:
            post.likes.add(request.user)
            liked = True
        return Response({'liked': liked, 'likes_count': post.likes.count()})
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        post.shares.add(request.user)
        return Response({'shares_count': post.shares.count()})
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def temp(request):
    post = Post.objects.all()
    posts = PostSerializer(post, many=True)
    return Response(posts.data)
