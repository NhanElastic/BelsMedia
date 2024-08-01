from django.db import models
from django.db.models.fields import CharField, EmailField, IntegerField, TextField
from django.db.models.fields.files import ImageField
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class UserProfile(models.Model):
    username = CharField(max_length=100, unique=True)
    email = EmailField(unique=True)
    password = CharField(max_length=100)
    profile_picture = ImageField(upload_to='profile_pics/', default=None)
    bio = TextField(default='')
    follower = IntegerField(default=0)
    following = IntegerField(default=0)

    def __str__(self):
        return self.username
    
    def set_password(self, password):
        self.password = make_password(password)
    
    def check_password(self, password):
        return check_password(password, self.password)
    



class Follower(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='followers')
    follower = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='followings')
    
    class Meta:
        unique_together = ('user', 'follower')

    def __str__(self):
        return f'{self.user.username} follows {self.follower.username}'


class RefreshToken(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.token