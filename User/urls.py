from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserLogoutView, UserProfileDetailView, UserUpdateView, ChangePasswordView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('user/<str:username>', UserProfileDetailView.as_view(), name='profile'),
    path('user/edit/<str:username>', UserUpdateView.as_view(), name='edit_profile'),
    path('user/change_password/<str:username>', ChangePasswordView.as_view(), name='change_password'),
]
