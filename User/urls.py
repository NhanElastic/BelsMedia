from django.urls import path
from .views import UserProfileDetailView, UserProfileUpdateView

urlpatterns = [
    path('profile/<str:username>/', UserProfileDetailView.as_view(), name='user-profile'),
    path('profile/<str:username>/update/', UserProfileUpdateView.as_view(), name='update-profile'),
]
