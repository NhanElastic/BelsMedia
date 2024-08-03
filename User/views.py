from rest_framework.views import APIView
from .forms.registration import RegistrationForm
from .forms.login import LoginForm
from django.shortcuts import render, redirect
from .models import UserProfile, RefreshToken
import jwt
from rest_framework.response import Response
from datetime import datetime, timedelta
from django.utils import timezone
# from .serializers import UserSerializer
# from datetime import timedelta
# from django.contrib.auth.hashers import make_password, check_password
import os


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
            user_id = user.id
            if user.check_password(password):
                if not RefreshToken.objects.filter(user=user).exists():
                    refresh_token = RefreshToken.GenerateRefreshToken(user_id=user_id)
                    refresh_token_object = RefreshToken.objects.create(
                        user = user,
                        token = refresh_token,
                        expired_at = timezone.now() + timedelta(days=3)
                    )
                    refresh_token_object.save()
                    access_token = RefreshToken.GenerateAccessToken(user_id=user_id)
                else:
                    access_token = RefreshToken.GenerateAccessToken(user_id=user_id)
                request.session['access_token'] = access_token
                return redirect('/home')
            return render(request, 'login/login.html', {'form': LoginForm(), 'error': 'Invalid username or password'})
        except UserProfile.DoesNotExist:
            return render(request, 'login/login.html', {'form': LoginForm(), 'error': 'Invalid username or password'})

class UserLogoutView(APIView):
    def get(self, request):
        token = request.session.get('access_token')
        data = RefreshToken.DecodeAccessToken(token)
        userid = data['user_id']
        RefreshToken.RemoveRefreshToken(user_id=userid)
        request.session.flush()
        return redirect('/login')
    
        
# class LoginWithRefreshTokenView(APIView):
#     def get(self, request, refresh_token):
#         try:
#             decoded = jwt.decode(refresh_token, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithms=['HS256'])
#             user = UserProfile.objects.get(id=decoded['user_id'])
#             access_token = jwt.encode({'user_id': user.id}, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithm='HS256')
#             request.session['user_id'] = user.id
#             return redirect('/home')
#         except jwt.ExpiredSignatureError:
#             return Response({'error': 'Refresh token expired'}, status=400)
        
class UserProfileDetailView(APIView):
    def get(self, request, username):
        try:
            user = UserProfile.objects.get(username=username)
            return render(request, 'user/user_profile.html', {'user': user})
        except UserProfile.DoesNotExist:
            return render(request, 'user/user_profile.html', {'error': 'User not found'})