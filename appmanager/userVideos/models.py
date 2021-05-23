from django.db import models
from userProfiles.models import Profile

# Create your models here.
class Video(models.Model):
    # Create from request.data
    video_title = models.CharField(max_length=70)
    video_description = models.CharField(max_length=400)
    creator_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="creator_profile")
    subject = models.CharField(max_length = 100)
    
    # Found within assets object attributes
    asset_id = models.CharField(max_length = 200)
    playback_id = models.CharField(max_length = 200)
    duration = models.FloatField()
    policy = models.CharField(max_length = 100)
    created_at = models.IntegerField()
    
    