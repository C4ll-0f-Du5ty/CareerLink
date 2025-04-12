from django.contrib import admin

# Register your models here.
from .models import CustomUser, UserProfile, FriendRequest

from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import AdminPasswordChangeForm



class SuperUserPasswordChangeForm(AdminPasswordChangeForm):
    def clean_new_password1(self):
        password = self.cleaned_data.get('new_password1')
        # Allowing superusers to set any password, bypassing validation
        if self.user.is_superuser:
            return password
        return super().clean_new_password1()


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Fields', {'fields': ('profile_image',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Fields', {'fields': ('profile_image',)}),
    )
    change_password_form = SuperUserPasswordChangeForm

admin.site.register(CustomUser, CustomUserAdmin)




# @admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    filter_horizontal = ('followers', 'friends')

admin.site.register(UserProfile, UserProfileAdmin)

admin.site.register(FriendRequest)
