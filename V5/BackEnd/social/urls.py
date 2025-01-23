from django.urls import path
from . import views


urlpatterns = [
    path("posts/<str:username>/", views.get_user_posts),
    path("posts/", views.get_latest_posts),
    path("search/", views.search),
    path("new/", views.create_post),
    path('posts/<int:post_id>/edit/', views.edit_post),
    path('posts/<int:post_id>/delete/', views.delete_post),
    path('likePost/<int:post_id>/', views.like_post),
    path('sharePost/<int:post_id>/', views.share_post),
    path('profile-with-posts/<str:username>/', views.get_profile_with_posts, name='get_profile_with_posts'),
    path('feed/', views.get_feed),
    path('temp/', views.temp),
]
