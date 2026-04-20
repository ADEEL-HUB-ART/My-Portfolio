from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.conf import settings
import logging
from .models import Project, CV
from .serializers import ProjectListSerializer, ProjectDetailSerializer, CVSerializer, ContactMessageSerializer


logger = logging.getLogger(__name__)

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer
    
    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

@api_view(['GET'])
def get_active_cv(request):
    cv = CV.objects.filter(is_active=True).first()
    if cv:
        serializer = CVSerializer(cv)
        return Response(serializer.data)
    return Response({'error': 'No active CV found'}, status=404)

@api_view(['GET'])
def get_active_profile(request):
    from .models import Profile
    profile = Profile.objects.filter(is_active=True).first()
    if profile:
        data = {
            'name': profile.name,
            'title': profile.title,
            'bio': profile.bio,
            'profile_image': request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None
        }
        return Response(data)
    return Response({'error': 'No active profile found'}, status=404)

@api_view(['POST'])
def contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        # Save to database
        serializer.save()

        email_queued = False
        recipients = [email for email in getattr(settings, 'CONTACT_RECIPIENTS', []) if email]

        # Send email in background only when SMTP credentials are configured.
        if settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD and recipients:
            from threading import Thread

            def send_email():
                try:
                    email = EmailMessage(
                        subject=(
                            f"[Portfolio] New Message from "
                            f"{serializer.validated_data['name']} "
                            f"({serializer.validated_data['email']})"
                        ),
                        body=f"""
New contact message from your portfolio:

Name: {serializer.validated_data['name']}
Email: {serializer.validated_data['email']}
Subject: {serializer.validated_data['subject']}

Message:
{serializer.validated_data['message']}
                        """,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=recipients,
                        reply_to=[serializer.validated_data['email']],
                    )
                    email.send(fail_silently=False)
                except Exception as e:
                    logger.exception("Contact email send failed: %s", e)

            Thread(target=send_email, daemon=True).start()
            email_queued = True
        else:
            logger.warning(
                "Contact email skipped. Configure EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, and CONTACT_RECIPIENTS."
            )

        return Response({
            'success': True,
            'email_queued': email_queued,
            'message': 'Thank you for your message! I will get back to you soon.'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
