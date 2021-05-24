from django.shortcuts import get_object_or_404
from mux_python.models.asset import Asset
from rest_framework import serializers, viewsets, status, mixins, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
import mux_python 
from .serializers import UploadResponseSerializer, CreateVideoSerializer, EditVideoSerializer
from userProfiles.models import Profile
from .models import Video
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.permissions import IsVideoOwnerOrReadOnly

MUX_TOKEN_ID = "aeb58192-9667-4f35-b882-d26a9ab85d02"
MUX_TOKEN_SECRET = "gEQvIDcuBHEtcOe2RtyBJGUKgISMS9C7Ula2AMS4MZKMD1abogA23aAJCqx84BS4Vxzezyp/AZf"

# Create your views here.

# Create direct url 
@api_view(['POST'])
def UploadVideo(request):
    # Create video
    if request.method == 'POST':

        # Authentication Setup
        configuration = mux_python.Configuration()
        configuration.username = MUX_TOKEN_ID
        configuration.password = MUX_TOKEN_SECRET

        # API Client Initialization
        uploads_api = mux_python.DirectUploadsApi(mux_python.ApiClient(configuration))
        
        # Return url api for direct upload
        create_asset_request = mux_python.CreateAssetRequest(playback_policy=[mux_python.PlaybackPolicy.PUBLIC])
        create_upload_request = mux_python.CreateUploadRequest(timeout=3600, new_asset_settings=create_asset_request,
             cors_origin="*", test=True)
        create_upload_response = uploads_api.create_direct_upload(create_upload_request)  
        
        print(create_upload_response)
        serialized = UploadResponseSerializer(create_upload_response.data)
        return Response(serialized.data)

# Upload video to mux using direct url
class AssetView(viewsets.ViewSet):
    def create(self, request, *args, **kwargs):
        # Authentication Setup
        configuration = mux_python.Configuration()
        configuration.username = MUX_TOKEN_ID
        configuration.password = MUX_TOKEN_SECRET

        # API Clients Initialization
        uploads_api = mux_python.DirectUploadsApi(mux_python.ApiClient(configuration))
        assets_api = mux_python.AssetsApi(mux_python.ApiClient(configuration))
        
        # GET asset_id to query asset
        upload_response = uploads_api.get_direct_upload(kwargs['upload_id'])
        if upload_response.data.status != 'asset_created':
            return Response("The video was not successfully uploaded, please try again.", 
                status=status.HTTP_404_NOT_FOUND)
        asset_id = upload_response.data.asset_id

        # GET asset using asset_id
        asset_response = assets_api.get_asset(asset_id)

        # Append API data to request data
        request.data['creator_profile'] = get_object_or_404(Profile, user=request.user.id).id
        request.data['asset_id'] = asset_id
        request.data['playback_id'] = asset_response.data.playback_ids[0].id
        request.data['duration'] = asset_response.data.duration
        request.data['policy'] = asset_response.data.playback_ids[0].policy
        request.data['created_at'] = asset_response.data.created_at

        # Check that same profile has created a video for the same subject
        check_existing = Video.objects.filter(creator_profile = request.data['creator_profile'], 
            subject=request.data['subject'])
        if check_existing.exists():
            return Response("You've already created a video for this particular subject", 
                status=status.HTTP_400_BAD_REQUEST)

        # Create serializer
        serializer = CreateVideoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# Get/Edit/Delete a video from video_id
class GetEditDeleteVideoView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    serializer_class = EditVideoSerializer
    
    def get(self, request, *args, **kwargs):
        print(self.kwargs['pk'])
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        # Call to API
        return self.destroy(request, *args, **kwargs)

    def get_object(self):
        print("we reached here")
        video = get_object_or_404(Video, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, video)
        return video

    def get_permissions(self):
        
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsVideoOwnerOrReadOnly]
        return [permission() for permission in permission_classes]
            
# Get all the user's videos