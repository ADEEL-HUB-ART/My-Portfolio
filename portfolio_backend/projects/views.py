from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Project, CV, ContactMessage
from .serializers import ProjectListSerializer, ProjectDetailSerializer, CVSerializer, ContactMessageSerializer

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
        contact = serializer.save()
        
        # Send email in background (non-blocking)
        from threading import Thread
        def send_email():
            try:
                send_mail(
                    subject=f"Portfolio Contact: {serializer.validated_data['subject']}",
                    message=f"""
New contact message from your portfolio:

Name: {serializer.validated_data['name']}
Email: {serializer.validated_data['email']}
Subject: {serializer.validated_data['subject']}

Message:
{serializer.validated_data['message']}
                    """,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=['rehmanadeel136@gmail.com'],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Email error: {e}")
        
        Thread(target=send_email).start()
        
        return Response({
            'success': True,
            'message': 'Thank you for your message! I will get back to you soon.'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
