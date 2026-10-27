import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers, views, viewsets, status
from rest_framework.response import Response
from apps.core.permissions import IsSuperAdminUser
from .models import MediaAsset

class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = [
            'id', 'title', 'file_url', 'public_id', 'file_type',
            'file_size_bytes', 'width', 'height', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AdminMediaUploadView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({
                'success': False,
                'error': {
                    'code': 'NO_FILE',
                    'message': 'No file was provided in the request.'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check file size (limit: 10MB)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({
                'success': False,
                'error': {
                    'code': 'FILE_TOO_LARGE',
                    'message': 'File size exceeds 10MB limit.'
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get('title') or uploaded_file.name
        content_type = uploaded_file.content_type
        file_type = 'image' if content_type.startswith('image/') else 'document'

        # Check if Cloudinary is configured
        if getattr(settings, 'CLOUDINARY_CLOUD_NAME', None) and getattr(settings, 'CLOUDINARY_API_KEY', None):
            try:
                import cloudinary.uploader
                upload_result = cloudinary.uploader.upload(
                    uploaded_file,
                    folder='raj_portfolio',
                    resource_type='auto'
                )
                file_url = upload_result.get('secure_url', upload_result.get('url'))
                public_id = upload_result.get('public_id', '')
                width = upload_result.get('width')
                height = upload_result.get('height')
            except Exception as e:
                return Response({
                    'success': False,
                    'error': {
                        'code': 'CLOUDINARY_ERROR',
                        'message': f'Failed to upload to Cloudinary: {str(e)}'
                    }
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # Local media fallback for development
            ext = os.path.splitext(uploaded_file.name)[1]
            unique_name = f"{uuid.uuid4().hex}{ext}"
            saved_path = default_storage.save(f"uploads/{unique_name}", uploaded_file)
            file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)
            public_id = saved_path
            width, height = None, None

        media_asset = MediaAsset.objects.create(
            title=title,
            file_url=file_url,
            public_id=public_id,
            file_type=file_type,
            file_size_bytes=uploaded_file.size,
            width=width,
            height=height
        )

        return Response({
            'success': True,
            'message': 'File uploaded successfully.',
            'data': MediaAssetSerializer(media_asset).data
        }, status=status.HTTP_201_CREATED)

class AdminMediaAssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = MediaAsset.objects.all().order_by('-created_at')
    serializer_class = MediaAssetSerializer

    def destroy(self, request, *args, **kwargs):
        asset = self.get_object()
        # Clean up Cloudinary asset if configured
        if getattr(settings, 'CLOUDINARY_CLOUD_NAME', None) and asset.public_id and not asset.public_id.startswith('uploads/'):
            try:
                import cloudinary.uploader
                cloudinary.uploader.destroy(asset.public_id)
            except Exception:
                pass
        elif asset.public_id and asset.public_id.startswith('uploads/'):
            try:
                if default_storage.exists(asset.public_id):
                    default_storage.delete(asset.public_id)
            except Exception:
                pass
        return super().destroy(request, *args, **kwargs)

