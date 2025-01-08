from rest_framework import serializers
from .models import CustomUser, UserProfile, ChatMessage, Notification
import urllib.parse


class CustomUserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'first_name', 'last_name', 'profile_image', 'bio']  # Include the email field
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
        # fields = ['user', 'followers_count', 'friends_count']
        fields = '__all__'

    def get_followers_count(self, obj):
        # print("my OBJ:", str(obj.user.username), '\n')
        return obj.followers.count()
    def get_friends_count(self, obj):
        return obj.friends.count()


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']


class NotificationSerializer(serializers.ModelSerializer):
    friend_request_id = serializers.IntegerField(source='friend_request.id', required=False, allow_null=True)

    class Meta:
        model = Notification
        fields = ['id', "is_read" ,'notification_type', 'from_user', 'created_at', 'friend_request_id']
