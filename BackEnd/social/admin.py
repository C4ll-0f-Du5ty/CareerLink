from django.contrib import admin
from .models import Post
# Register your models here.


# @admin.register(UserProfile)
class PostAdmin(admin.ModelAdmin):
    filter_horizontal = ('likes', 'shares')

admin.site.register(Post, PostAdmin)
