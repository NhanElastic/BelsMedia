from django.urls import path
from .views import UserRegistrationView, UserLoginView

urlpatterns = [
    # path('profile/<str:username>/', UserProfileDetailView.as_view(), name='user-profile'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
]
