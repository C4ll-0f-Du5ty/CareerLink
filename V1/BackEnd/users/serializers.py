from rest_framework import serializers
from .models import CustomUser, UserProfile, ChatMessage
import urllib.parse


class CustomUserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'profile_image', 'bio']  # Include the email field
        extra_kwargs = {
            'password': {'write_only': True, 'required': True}  # Ensure the password is write-only
        }

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

    def get_profile_image(self, obj):
        return urllib.parse.unquote(obj.profile_image.url)




class UserProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    followers_count = serializers.SerializerMethodField()
    friends_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['user', 'followers_count', 'friends_count']

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_friends_count(self, obj):
        return obj.friends.count()


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']
