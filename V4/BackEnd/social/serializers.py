from rest_framework import serializers
from .models import Post, CustomUser

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    # likes = serializers.StringRelatedField(many=True)
    category = serializers.ChoiceField(choices=Post.CATEGORY_CHOICES)

    class Meta:
        model = Post
        fields = '__all__'
        extra_kwargs = {'title': {'required': True}}

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['likes_count'] = instance.likes.count()
        rep['shares_count'] = instance.shares.count()
        return rep
