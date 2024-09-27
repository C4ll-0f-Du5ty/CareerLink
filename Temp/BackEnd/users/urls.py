from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, get_profile, get_all_users, get_all_users_with_profiles

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path("profile/<str:username>/", get_profile),
    path("all/", get_all_users), 
    path("allPP/", get_all_users_with_profiles), 
    path('', include(router.urls)),
]
