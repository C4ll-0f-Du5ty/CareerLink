from django.contrib import admin

# Register your models here.
from .models import CustomUser, UserProfile, FriendRequest

admin.site.register(CustomUser)


# @admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    filter_horizontal = ('followers', 'friends')

admin.site.register(UserProfile, UserProfileAdmin)

admin.site.register(FriendRequest)
