from django import forms
from ..models import UserProfile
class EditProfileForm(forms.Form):
    username = forms.CharField(max_length=100, required=False)
    email = forms.EmailField(required=False)
    profile_picture = forms.ImageField(required=False)
    bio = forms.CharField(widget=forms.Textarea, required=False)

    def clean_username(self):
        username = self.cleaned_data['username']
        if UserProfile.objects.filter(username=username).exists():
            raise forms.ValidationError('Username is already taken.')
        return username
    
    def clean_email(self):
        email = self.cleaned_data['email']
        if UserProfile.objects.filter(email=email).exists():
            raise forms.ValidationError('Email is already taken.')
        return email
    

    def save(self, user):
        user.username = self.cleaned_data['username'] if self.cleaned_data['username'] else user.username
        user.email = self.cleaned_data['email'] if self.cleaned_data['email'] else user.email
        user.profile_picture = self.cleaned_data['profile_picture'] if self.cleaned_data['profile_picture'] else user.profile_picture
        user.bio = self.cleaned_data['bio'] if self.cleaned_data['bio'] else user.bio
        user.save()
        return user