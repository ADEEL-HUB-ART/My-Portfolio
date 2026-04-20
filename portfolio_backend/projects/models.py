from django.db import models

class Project(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Application'),
        ('mobile', 'Mobile Application'),
        ('api', 'API/Backend'),
        ('design', 'Design'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    short_description = models.TextField(max_length=300)
    full_description = models.TextField()
    technologies = models.CharField(max_length=500, help_text="Comma separated (e.g., Django, PostgreSQL, Docker)")
    requirements = models.TextField(blank=True)
    github_link = models.URLField(blank=True)
    live_link = models.URLField(blank=True)
    thumbnail = models.ImageField(upload_to='projects/thumbnails/', blank=True, null=True)
    video = models.FileField(upload_to='projects/videos/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-order', '-created_at']
    
    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='projects/images/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.project.title} - Image {self.order}"

class CV(models.Model):
    file = models.FileField(upload_to='cv/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "CV"
        verbose_name_plural = "CVs"
    
    def __str__(self):
        return f"CV - {self.uploaded_at.strftime('%Y-%m-%d')}"

class Profile(models.Model):
    name = models.CharField(max_length=200, default="Adeel Ur Rehman")
    title = models.CharField(max_length=300, default="Backend Developer | Python Django Expert | API Specialist")
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    bio = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profile"
    
    def __str__(self):
        return self.name

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
