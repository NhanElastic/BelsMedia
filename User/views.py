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

                request.session['user_id'] = user.id

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
                return redirect('/home')
            return render(request, 'login/login.html', {'form': LoginForm(), 'error': 'Invalid username or password'})
        except UserProfile.DoesNotExist:
            return render(request, 'login/login.html', {'form': LoginForm(), 'error': 'Invalid username or password'})

class UserLogoutView(APIView):
    def get(self, request):
        request.session.flush()
        return redirect('/login')
    
        
class LoginWithRefreshTokenView(APIView):
    def get(self, request, refresh_token):
        try:
            decoded = jwt.decode(refresh_token, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithms=['HS256'])
            user = UserProfile.objects.get(id=decoded['user_id'])
            access_token = jwt.encode({'user_id': user.id}, 'Iy1F4z9FPN-EvBMeATyYjoJeQ2GvzbaNmL1ygSeVAP8', algorithm='HS256')
            request.session['user_id'] = user.id
            return redirect('/home')
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=400)
        
class UserProfileDetailView(APIView):
    def get(self, request, username):
        try:
            user = UserProfile.objects.get(username=username)
            return render(request, 'user/user_profile.html', {'user': user})
        except UserProfile.DoesNotExist:
            return render(request, 'user/user_profile.html', {'error': 'User not found'})