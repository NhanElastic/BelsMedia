from django import forms
import re
from ..models import UserProfile
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password
class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=50)
    email = forms.EmailField()
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def clean_password2(self):
        if 'password1' in self.cleaned_data:
            password1 = self.cleaned_data['password1']
            password2 = self.cleaned_data['password2']
            if password1 == password2:
                return password2
        raise forms.ValidationError('Passwords do not match.')
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError('Username can only contain alphanumeric characters and the underscore.')
        try:
            UserProfile.objects.get(username=username)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('Username is already taken.')
    
    def save(self):
        username = self.cleaned_data['username']
        email = self.cleaned_data['email']
        password = self.cleaned_data['password1']
        print(password)
        new_user = UserProfile.objects.create(username=username, email=email, password=make_password(password))
