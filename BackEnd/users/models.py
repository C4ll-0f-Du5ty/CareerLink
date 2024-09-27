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
        return f"Friend request from {self.from_user} to {self.to_user}"


class ChatMessage(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='chat_files/', blank=True, null=True)
    thread = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE)
