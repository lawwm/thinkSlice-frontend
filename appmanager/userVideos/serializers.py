from django.db.models.fields import IntegerField
from mux_python.models.asset import Asset
from rest_framework import serializers
from mux_python import UploadResponse
from .models import Video

class UploadResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    status = serializers.CharField()
    url = serializers.URLField()
    timeout = IntegerField()

class CreateVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
        
