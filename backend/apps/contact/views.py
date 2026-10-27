from rest_framework import serializers, views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from apps.core.permissions import IsSuperAdminUser
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'sender_name', 'sender_email', 'subject', 'message',
            'is_read', 'is_archived', 'ip_address', 'created_at'
        ]
        read_only_fields = ['id', 'ip_address', 'created_at']

class PublicContactSubmitSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField(max_length=5000)

class PublicContactSubmitView(views.APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'contact'

    def post(self, request):
        serializer = PublicContactSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        ip = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip:
            ip = ip.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')

        msg = ContactMessage.objects.create(
            sender_name=data['name'],
            sender_email=data['email'],
            subject=data['subject'],
            message=data['message'],
            ip_address=ip
        )

        return Response({
            'success': True,
            'message': 'Thank you! Your message has been sent successfully. I will get back to you shortly.',
            'data': {
                'id': str(msg.id)
            }
        }, status=status.HTTP_201_CREATED)

class AdminContactMessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        is_read = self.request.query_params.get('is_read')
        is_archived = self.request.query_params.get('is_archived')
        q = self.request.query_params.get('q')

        if is_read is not None:
            qs = qs.filter(is_read=is_read.lower() == 'true')
        if is_archived is not None:
            qs = qs.filter(is_archived=is_archived.lower() == 'true')
        if q:
            qs = qs.filter(Q(sender_name__icontains=q) | Q(sender_email__icontains=q) | Q(subject__icontains=q) | Q(message__icontains=q))

        return qs
