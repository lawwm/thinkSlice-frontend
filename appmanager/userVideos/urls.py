from django.urls import path, include
from .views import UploadVideo, AssetView

AssetViewAsView = AssetView.as_view({
    'post': 'create'
})

urlpatterns = [ 
    path('api/videos/', UploadVideo, name='direct_url'),
    path('api/videos/<str:upload_id>', AssetViewAsView, name="handle_review"),
]