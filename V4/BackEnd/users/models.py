from django.db import models

# Create your models here.
# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom user model where username is unique and profile image is optional (with default).
    """
    username = models.CharField(max_length=150, unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default.jpg')
    bio = models.TextField(blank=True, null=True)
    # raw_password = models.CharField(max_length=128, blank=True, null=True)

    def __str__(self):
        return self.username

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()




class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    followers = models.ManyToManyField(CustomUser, related_name='followers', blank=True)
    friends = models.ManyToManyField(CustomUser, related_name='friends', blank=True)

    def __str__(self):
        return self.user.username

    def add_friend(self, friend_user):
        """
        Add a friend and make sure the relationship is reciprocal.
        """
        self.friends.add(friend_user)  # Add friend
        friend_user_profile, created = UserProfile.objects.get_or_create(user=friend_user)
        if self.user not in friend_user_profile.friends.all():
            friend_user_profile.friends.add(self.user)  # Ensure reciprocity

    def remove_friend(self, friend_user):
        """
        Remove a friend and ensure the relationship is no longer mutual.
        """
        self.friends.remove(friend_user)  # Remove friend
        friend_user_profile, created = UserProfile.objects.get_or_create(user=friend_user)
        if self.user in friend_user_profile.friends.all():
            friend_user_profile.friends.remove(self.user)  # Ensure reciprocity



class FriendRequest(models.Model):
    from_user = models.ForeignKey(CustomUser, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(CustomUser, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    def accept(self):
        self.is_accepted = True
        self.save()

        # Ensure symmetrical friendship
        self.from_user.userprofile.friends.add(self.to_user)
        self.to_user.userprofile.friends.add(self.from_user)

    def __str__(self):
        return f"Friend request from {self.from_user} to {self.to_user}\
            its state is {self.is_accepted}\
                created at {self.created_at}"


class ChatMessage(models.Model):
    """
    Model to store chat messages between users.
    """
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sent_messages", default='')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_messages", default='')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:30]}"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('friend_request', 'Friend Request'),
        ('like', 'Like'),
        ('share', 'Share'),
        # Add more types as needed
    ]
    
    user = models.ForeignKey(CustomUser, related_name='notifications', on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    from_user = models.ForeignKey(CustomUser, related_name='from_user', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    friend_request = models.ForeignKey(FriendRequest, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.from_user} {self.notification_type} to {self.user}"
