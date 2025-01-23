from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, UserProfile, ChatMessage, FriendRequest, Notification
from .serializers import CustomUserSerializer, UserProfileSerializer, ChatMessageSerializer, NotificationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_profile(request, username=None):
    # getting a specific user profile by Username
    if username:
        profile = get_object_or_404(UserProfile, user__username=username)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def update_profile(request):
#     user = CustomUser.objects.get(username=request.user)
#     data = request.data

#     # Check if the username is already taken
#     if CustomUser.objects.filter(username=data.get('username')).exclude(id=user.id).exists():
#         return Response(
#             {"error": "This username is already taken. Please choose a different one."},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # Update fields
#     user.username = data.get('username', user.username)
#     user.first_name = data.get('first_name', user.first_name)
#     user.last_name = data.get('last_name', user.last_name)
#     user.email = data.get('email', user.email)
#     user.bio = data.get('bio', user.bio)
#     user.save()

#     return Response(
#         {"message": "Profile updated successfully."},
#         status=status.HTTP_200_OK
#     )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data

    # Check if the username is already taken
    if 'username' in data and CustomUser.objects.filter(username=data['username']).exclude(id=user.id).exists():
        return Response(
            {"error": "This username is already taken. Please choose a different one."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update fields only if they are provided
    user.username = data.get('username', user.username)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.bio = data.get('bio', user.bio)
    user.save()

    return Response(
        {"message": "Profile updated successfully.", "username": user.username, "bio": user.bio},
            status=status.HTTP_200_OK 
    )



#Getting all users with their profiles
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





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_friends(request, username):
    try:
        user = CustomUser.objects.get(username=username)
        profile = UserProfile.objects.get(user=user)
        friends_data = profile.friends.all()
        friends = CustomUserSerializer(friends_data, many=True).data
        # print(user,"--------------" ,profile.friends.all())
        return Response(friends)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, friend_username):
    user = request.user
    print(user, "first-------------------------------------------------")
    # friend = CustomUser.objects.get(username=friend_username)
    friend = get_object_or_404(CustomUser, username=friend_username)
    print(friend, "second-------------------------------------------------")
    # Get chat messages where the user is either sender or receiver with the friend
    chat_history = ChatMessage.objects.filter(
        (Q(sender=user) & Q(receiver=friend)) |
        (Q(sender=friend) & Q(receiver=user))
    ).order_by('timestamp')
    
    serializer = ChatMessageSerializer(chat_history, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):
    try:
        print("request_ID", request_id, "GGG", request.user)
        friend_request = FriendRequest.objects.get(id=request_id, to_user=request.user)
        print("\n \nfriend", friend_request)
        friend_request.accept()
        
        # Mark notification as read
        notification = Notification.objects.get(user=request.user, from_user=friend_request.from_user, notification_type='friend_request', friend_request=friend_request)
        notification.is_read = True
        notification.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
    except FriendRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request, username):
    try:
        # Get the user to whom the friend request is being sent
        to_user = CustomUser.objects.get(username=username)

        # Check if there is an existing pending friend request
        existing_request = FriendRequest.objects.filter(from_user=request.user, to_user=to_user, is_accepted=False).exists()
        
        # print("friendRequest_11", existing_request)
        if existing_request:
            return Response({'error': 'Friend request already sent'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the users are already friends
        if request.user.userprofile.friends.filter(id=to_user.id).exists():
            # print("friendRequest_22", existing_request)
            
            return Response({'error': 'You are already friends with this user'}, status=status.HTTP_400_BAD_REQUEST)

        # Create new friend request (get_or_create returns a tuple: (object, created))
        friend_request, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user=to_user)
        
        # Create notification for the friend request only if the request is newly created
        # print("friendRequest",friend_request)
        if created:
            Notification.objects.create(
                user=to_user,
                notification_type='friend_request',
                from_user=request.user,
                friend_request=friend_request,  # Pass the actual friend_request object here
            )
        
        return Response({'success': 'Friend request sent'}, status=status.HTTP_201_CREATED)
    
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user, friend_request__is_accepted=False).order_by('-created_at')
    # print(NotificationSerializer(notifications))
    print(list(n.friend_request for n in notifications))
    return Response([
        {
            'id': notification.id,
            'from_user': notification.from_user.username,
            'type': notification.notification_type,
            'created_at': notification.created_at,
            'is_read': notification.is_read,
            'friend_request': notification.friend_request.id,
            'friend_request_state': notification.friend_request.is_accepted,
        } for notification in notifications
    ])


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_image(request):
    try:
        print("request: ", request.user)
        user_profile = CustomUser.objects.get(username=request.user)

        if 'profile_image' in request.FILES:
            user_profile.profile_image = request.FILES['profile_image']
            user_profile.save()
            return Response({'message': 'Profile image updated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)


















# To fix problems with friend relations
from users.models import CustomUser, UserProfile
def fix_friendships():
    
    users = CustomUser.objects.all()

    for user in users:
        user_profile = user.userprofile
        # Get all the friends of this user
        for friend in user_profile.friends.all():
            friend_profile = friend.userprofile
            # Check if the friend has this user in their friend list, if not, add them
            if user not in friend_profile.friends.all():
                friend_profile.friends.add(user)
                print(f"Added {user} as a friend of {friend}")
    print("Friendship symmetry fix completed.")



def delete_all_friend_requests_and_notifications():
    # Delete all notifications related to friend requests
    Notification.objects.filter(notification_type='friend_request').delete()

    # Delete all friend requests
    FriendRequest.objects.all().delete()

    print("All friend requests and related notifications have been deleted.")
