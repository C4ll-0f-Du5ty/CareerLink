from django.urls import path
from . import views

urlpatterns = [
    path("profile/<str:username>/", views.get_profile),
    path("all/", views.get_all_users_with_profiles), 
    path("friends/<str:username>/", views.get_user_friends),
    path('chatHistory/<str:friend_username>/', views.get_chat_history, name="chat-history/"),
    path('friend-request/<str:username>/', views.send_friend_request, name='send_friend_request'),
    path('friend-request/accept/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('update_image/', views.update_profile_image),
    path('update/', views.update_profile),
    # path('temp/', views.temp),
]
