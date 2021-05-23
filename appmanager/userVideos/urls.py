from django.urls import path, include
from .views import UploadVideo, AssetView, GetEditDeleteVideoView

AssetViewAsView = AssetView.as_view({
    'post': 'create'
})

urlpatterns = [ 
    path('api/videos/assets', UploadVideo, name='direct_url'),
    path('api/videos/assets/<str:upload_id>', AssetViewAsView, name="upload_video"),
    path('api/videos/<int:pk>', GetEditDeleteVideoView.as_view(), name='handle_video')
]