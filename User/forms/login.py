from django import forms
class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)

    

    
        # try:
        #     user = UserProfile.objects.get(username=username)
        #     check = check_password(password, user.password)
        #     print(check)
        #     if check:
        #         refresh = RefreshToken.for_user(user)
        #         refresh.set_exp(lifetime=timedelta(days=3))
        #         refresh.access_token.set_exp(lifetime=timedelta(minutes=15))
        #         return {'refresh': str(refresh), 'access': str(refresh.access_token), 'username': user.username}
        # except UserProfile.DoesNotExist:
        #     return {'error': 'Invalid username or password'}
        # return {'error': 'Invalid username or password'}