from django.db import models
from django.db.models.fields import CharField, EmailField, IntegerField, TextField
from django.db.models.fields.files import ImageField

# Create your models here.


class UserProfile(models.Model):
    username = CharField(max_length=100, unique=True)
    email = EmailField(unique=True)
    password = CharField(max_length=100)
    profile_picture = ImageField(upload_to='profile_pics/', default=None)
    bio = TextField(default='')
    follower = IntegerField(default=0)
    follwing = IntegerField(default=0)

    def __str__(self):
        return self.username


class Follower(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='followers')
    follower = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='following')
    
    class Meta:
        unique_together = ('user', 'follower')

    def __str__(self):
        return f'{self.user.username} follows {self.follower.username}'