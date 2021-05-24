from rest_framework import serializers
from .models import Profile

# General Profile Serializers
class ProfileGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'profile_pic', 'username', 'user_bio', 'is_tutor', "is_student", 'user']
        extra_kwargs = {'user' : {'read_only': True} }

class ProfilePictureSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(        
        max_length=None,
        use_url=True
    )

    class Meta:
        model = Profile
        fields = ['profile_pic']

# Detailed Profile Serializers
class ProfileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['tutor_contact', 'aggregate_star', 'duration_classes', 
        'subjects', 'total_tutor_reviews', 'qualifications']
        extra_kwargs = {'user' : {'read_only': True} }
