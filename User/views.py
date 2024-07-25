from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import UserProfile
from .forms import UserProfileUpdateForm
from .serializers import UserSerializer
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.

class UserRegistrationView(APIView):
    def post(self, request):
        form = UserSerializer(data=request.data)
        if form.is_valid():
            form.validated_data['password'] = make_password(form.validated_data['password'])
            form.save()
            return JsonResponse(form.data, status=201)
        return JsonResponse({'errors': form.errors}, status=400)
    
class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return JsonResponse({'error': 'Please provide both username and password'}, status=400)
        try:
            user = UserProfile.objects.get(username=username)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)

                #set token expiration time
                refresh.set_exp(lifetime=timedelta(days=3))
                refresh.access_token.set_exp(lifetime=timedelta(minutes=15))             

                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'username': user.username
                })
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)
        


class UserProfileDetailView(APIView):
    def get(self, request, username):
        user_profile = get_object_or_404(UserProfile, username=username)
        return JsonResponse({
            'username': user_profile.username,
            'email': user_profile.email,
            'bio': user_profile.bio,
            'profile_picture': user_profile.profile_picture.url if user_profile.profile_picture else None
        })
    
class UserProfileUpdateView(APIView):
    def post(self, request, username):
        user_profile = get_object_or_404(UserProfile, username=username)
        form = UserProfileUpdateForm(request.POST, request.FILES, instance=user_profile)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Profile updated successfully.'})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
        