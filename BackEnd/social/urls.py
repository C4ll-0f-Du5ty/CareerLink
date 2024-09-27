from django.urls import path
from . import views


urlpatterns = [
    path("posts/<str:username>/", views.get_user_posts),
    path("posts/latest", views.get_latest_posts),
    path("search/", views.search),
    path("new/", views.create_post),
]
