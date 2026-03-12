from rest_framework import serializers
from .models import Project, ProjectImage, CV, ContactMessage

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order']

class ProjectListSerializer(serializers.ModelSerializer):
    technologies_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'category', 'short_description', 
                  'technologies_list', 'thumbnail', 'github_link', 'live_link']
    
    def get_technologies_list(self, obj):
        return [tech.strip() for tech in obj.technologies.split(',')]

class ProjectDetailSerializer(serializers.ModelSerializer):
    technologies_list = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'category', 'short_description', 
                  'full_description', 'requirements', 'technologies_list', 
                  'thumbnail', 'video', 'images', 'github_link', 'live_link', 'created_at']
    
    def get_technologies_list(self, obj):
        return [tech.strip() for tech in obj.technologies.split(',')]

class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = ['id', 'file', 'uploaded_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
