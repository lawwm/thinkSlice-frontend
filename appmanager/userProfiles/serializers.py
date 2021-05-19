from rest_framework import serializers
from .models import Profile

# Create Profile Serializers

class ProfileGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'profile_pic', 'username', 'user_bio', 'is_tutor', "is_student", 'user']
        extra_kwargs = {'user' : {'read_only': True} }

class ProfileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['tutor_contact', 'aggregate_star', 'duration_classes', 
        'subjects', 'total_tutor_reviews', 'qualifications']
        extra_kwargs = {'user' : {'read_only': True} }
