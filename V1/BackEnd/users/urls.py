from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import UserProfileViewSet, get_profile, get_all_users_with_profiles, get_user_friends, get_chat_history
from . import views
# router = DefaultRouter()
# router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path("profile/<str:username>/", views.get_profile),
    # path("all/", get_all_users), 
    path("all/", views.get_all_users_with_profiles), 
    # path('', include(router.urls)),
    path("friends/<str:username>/", views.get_user_friends),
    path('chatHistory/<str:friend_username>/', views.get_chat_history, name="chat-history"),
    path('friend-request/<str:username>/', views.send_friend_request, name='send_friend_request'),
    path('friend-request/accept/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('notifications/', views.get_notifications, name='get_notifications'),
]
