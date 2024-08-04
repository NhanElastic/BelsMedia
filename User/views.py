from rest_framework.views import APIView
from .forms.registration import RegistrationForm
from .forms.login import LoginForm
from django.shortcuts import render, redirect
from .models import UserProfile, RefreshToken
from datetime import datetime, timedelta
from django.utils import timezone
# from .serializers import UserSerializer
# from datetime import timedelta
# from django.contrib.auth.hashers import make_password, check_password
from .forms.edit_profile import EditProfileForm
from .forms.change_password import ChangePasswordForm

# Create your views here.


class UserRegistrationView(APIView):
    def get(self, request):
        return render(request, 'registration/register.html', {'form': RegistrationForm()})
    
    def post(self, request):
        form = RegistrationForm(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            form.save()
            return redirect('/login')
        else:
            return render(request, 'registration/register.html', {'form': form})

class UserLoginView(APIView):
    def get(self, request): 
        if request.session.get('access_token'):
            return redirect('/')
        
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
                return redirect('/')
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
    
class UserProfileDetailView(APIView):
    def get(self, request, username):
        try:
            user = UserProfile.objects.get(username=username)
            print(user.username)
            return render(request, 'user/user_profile.html', {'user': user})
        except UserProfile.DoesNotExist:
            return render(request, 'user/user_profile.html', {'error': 'User not found'})

class UserUpdateView(APIView):
    def get(self, request, username):
        try:
            user = UserProfile.objects.get(username=username)
            return render(request, 'user/update_profile.html', {'form': EditProfileForm()})
        except UserProfile.DoesNotExist:
            return redirect('/login')

    def post(self, request, username):
        try:
            user = UserProfile.objects.get(username=username)
            form = EditProfileForm(request.POST, request.FILES)
            if form.is_valid():
                user = form.save(user)
                token = RefreshToken.GenerateAccessToken(user_id = user.id)
                del request.session['access_token']
                request.session['access_token'] = token
            return redirect(f'/user/{user.username}')
        except UserProfile.DoesNotExist:
            return render(request, 'user/update_profile.html', {'error': 'User not found'})
        
class ChangePasswordView(APIView):
    def get(self, request, username):
        user = UserProfile.objects.get(username=username)
        return render(request, 'user/change_password.html', {'form': ChangePasswordForm(), 'user': user})

    def post(self, request, username):
        try:
            user = UserProfile.objects.get(username=username)
            print(request.POST)
            print(request.FILES)
            form = ChangePasswordForm(request.POST, request.FILES)
            if form.is_valid():
                if not user.check_password(form.cleaned_data['old_password']):
                    return render(request, 'user/change_password.html', {'form': form, 'error': 'Invalid password', 'user': user})
                elif form.cleaned_data['new_password'] != form.cleaned_data['confirm_password']:
                    return render(request, 'user/change_password.html', {'form': form, 'error': 'Password does not match', 'user': user})
                user.set_password(form.cleaned_data['new_password'])
                user.save()
                token = RefreshToken.GenerateAccessToken(user_id = user.id)
                del request.session['access_token']
                request.session['access_token'] = token
                return redirect(f'/user/{user.username}')
            return render(request, 'user/change_password.html', {'form': form})
        except UserProfile.DoesNotExist:
            return render(request, 'user/change_password.html', {'error': 'User not found'})
        