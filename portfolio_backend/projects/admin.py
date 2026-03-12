from django.contrib import admin
from .models import Project, ProjectImage, CV, ContactMessage, Profile

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_featured', 'order', 'created_at']
    list_filter = ['category', 'is_featured']
    search_fields = ['title', 'short_description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category', 'is_featured', 'order')
        }),
        ('Description', {
            'fields': ('short_description', 'full_description', 'requirements')
        }),
        ('Technical Details', {
            'fields': ('technologies',)
        }),
        ('Media', {
            'fields': ('thumbnail', 'video')
        }),
        ('Links', {
            'fields': ('github_link', 'live_link')
        }),
    )

@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ['uploaded_at', 'is_active']
    list_filter = ['is_active']
    
    def save_model(self, request, obj, form, change):
        if obj.is_active:
            CV.objects.filter(is_active=True).update(is_active=False)
        super().save_model(request, obj, form, change)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    
    def has_add_permission(self, request):
        return False

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'is_active']
    fields = ['name', 'title', 'profile_image', 'bio', 'is_active']
    
    def save_model(self, request, obj, form, change):
        if obj.is_active:
            Profile.objects.filter(is_active=True).update(is_active=False)
        super().save_model(request, obj, form, change)
