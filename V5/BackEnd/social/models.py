from django.db import models
from users.models import CustomUser


class Post(models.Model):
    """
    Model to represent user posts which can have different categories like job posts or social content.
    """

    CATEGORY_CHOICES = [
        ('job', 'Job Post'),
        ('social', 'Social Post'),
        ('education', 'Educational Post'),
    ]

    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default="default")
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='social')
    created_at = models.DateTimeField(auto_now_add=True)

    likes = models.ManyToManyField(CustomUser, related_name='liked_post', blank=True)
    shares = models.ManyToManyField(CustomUser, related_name='shared_post', blank=True)

    def __str__(self):
        return f'{self.author.username} - {self.get_category_display()}'
