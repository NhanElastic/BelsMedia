from rest_framework.views import APIView
from .forms.registration import RegistrationForm
from .forms.login import LoginForm
from django.shortcuts import render, redirect
from .models import UserProfile, RefreshToken
import jwt
from rest_framework.response import Response
from datetime import datetime, timedelta
# from .serializers import UserSerializer
# from datetime import timedelta
# from django.contrib.auth.hashers import make_password, check_password


# Create your views here.


class UserRegistrationView(APIView):
    def get(self, request):
        return render(request, 'registration/register.html', {'form': RegistrationForm()})
    def post(self, request):
        form = RegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('/login')
        else:
            return render(request, 'registration/register.html', {'form': form})

class UserLoginView(APIView):
    def get(self, request): 
        return render(request, 'login/login.html', {'form': LoginForm()})

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = UserProfile.objects.get(username=username)
            if user.check_password(password):
                access_token = jwt.encode({'user_id': user.id}, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithm='HS256') # secrete key se duoc luu vao file .env 
                refresh_token = jwt.encode({'user_id': user.id}, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithm='HS256')
                
                if RefreshToken.objects.filter(user_id = user.id).exists():
                    refresh_token_obj = RefreshToken.objects.get(user_id=user.id)
                    refresh_token_obj.token = refresh_token
                    refresh_token_obj.expired_at = datetime.utcnow() + timedelta(days=3)
                    refresh_token_obj.save()
                else:
                    refresh_token_obj = RefreshToken.objects.create(
                        user=user,
                        token=refresh_token,
                        expired_at=datetime.utcnow() + timedelta(days=3)
                    )
                return Response({'access_token': access_token, 'refresh_token': refresh_token})
            return render(request, 'login/login.html', {'form': LoginForm(), 'error': 'Invalid username or password'})
        except UserProfile.DoesNotExist:
            return render(request, 'login/login.html', {'form': LoginForm(), 'error': 'Invalid username or password'})
        
class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        try:
            refresh_token_obj = RefreshToken.objects.get(token=refresh_token)
            if refresh_token_obj.is_active:
                access_token = jwt.encode({'user_id': refresh_token_obj.user.id}, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithm='HS256')
                return Response({'access_token': access_token})
            return Response({'error': 'Refresh token is expired'}, status=400)
        except RefreshToken.DoesNotExist:
            return Response({'error': 'Invalid refresh token'}, status=400)

# class UserLoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         if not username or not password:
#             return JsonResponse({'error': 'Please provide both username and password'}, status=400)
#         try:
#             user = UserProfile.objects.get(username=username)
#             if check_password(password, user.password):
#                 refresh = RefreshToken.for_user(user)

#                 #set token expiration time
#                 refresh.set_exp(lifetime=timedelta(days=3))
#                 refresh.access_token.set_exp(lifetime=timedelta(minutes=15))             

#                 return JsonResponse({
#                     'refresh': str(refresh),
#                     'access': str(refresh.access_token),
#                     'username': user.username
#                 })
#         except UserProfile.DoesNotExist:
#             return JsonResponse({'error': 'Invalid username or password'}, status=400)
        


# class UserProfileDetailView(APIView):
#     def get(self, request, username):
#         user_profile = get_object_or_404(UserProfile, username=username)
#         return JsonResponse({
#             'username': user_profile.username,
#             'email': user_profile.email,
#             'bio': user_profile.bio,
#             'profile_picture': user_profile.profile_picture.url if user_profile.profile_picture else None
#         })
    
# class UserProfileUpdateView(APIView):
#     def post(self, request, username):
#         user_profile = get_object_or_404(UserProfile, username=username)
#         form = UserProfileUpdateForm(request.POST, request.FILES, instance=user_profile)
#         if form.is_valid():
#             form.save()
#             return JsonResponse({'message': 'Profile updated successfully.'})
#         else:
#             return JsonResponse({'errors': form.errors}, status=400)
        