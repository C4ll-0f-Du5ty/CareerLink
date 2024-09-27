from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, UserProfile
from .serializers import CustomUserSerializer, UserProfileSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework import status

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
    # getting a specific user profile by Username
    if username:
        profile = get_object_or_404(UserProfile, user__username=username)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


# # Getting all users ------- NOT USED YET
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_all_users(request):
#     users = CustomUser.objects.all()
#     serializer = CustomUserSerializer(users, many=True)
#     return Response(serializer.data)


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


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_friends(request, username):
#     friends = []
#     user = CustomUser.objects.get(username=username)
#     pr = UserProfile.objects.get(user=user)
#     profile = UserProfileSerializer(pr.friends)
#     for f in profile.data:
#         temp = CustomUser.objects.get(id=f)
#         friends.append(CustomUserSerializer(temp))
#     return Response(friends)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_friends(request, username):
    try:
        user = CustomUser.objects.get(username=username)
        profile = UserProfile.objects.get(user=user)
        friends_data = profile.friends.all()
        friends = CustomUserSerializer(friends_data, many=True).data
        print(user,"--------------" ,profile.friends.all())
        return Response(friends)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
