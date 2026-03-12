from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cv/', views.get_active_cv, name='active-cv'),
    path('contact/', views.contact_message, name='contact'),
    path('profile/', views.get_active_profile, name='active-profile'),
]
