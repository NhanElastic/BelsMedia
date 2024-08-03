from django.db import models
from django.db.models.fields import CharField, EmailField, IntegerField, TextField
from django.db.models.fields.files import ImageField
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import os, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from django.utils import timezone



load_dotenv()


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
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()
    
    def __str__(self):
        return self.token
    
    def DecodeAccessToken(AccessToken):
        AccessToken = AccessToken.encode('utf-8')
        return jwt.decode(AccessToken, os.environ['ACCESS_TOKEN_SECRETE_KEY'], algorithms='HS256')
    
    def DecodeRefreshToken(RefreshToken):
        RefreshToken = RefreshToken.encode('utf-8')
        return jwt.decode(RefreshToken, os.environ['REFRESH_TOKEN_SECRETE_KEY'], algorithms='HS256')
    
    def RemoveRefreshToken(user_id) -> None:
        token = RefreshToken.objects.get(user_id = user_id)
        token.delete()


    def GenerateRefreshToken(user_id: int):
        secrete_key = os.environ.get('REFRESH_TOKEN_SECRETE_KEY')
        payload = {
            'user_id': user_id,
            'exp': int((timezone.now() + timedelta(days=3)).timestamp())
        }

        token = jwt.encode(payload, secrete_key, algorithm='HS256')
        return token.decode('utf-8')
    

    def GenerateAccessToken(user_id: int):
        secrete_key = os.environ['ACCESS_TOKEN_SECRETE_KEY']
        expire_time = timezone.now() + timedelta(minutes=15)
        payload = {
            'user_id': user_id,
            'exp': int(expire_time.timestamp())
        }
        token = jwt.encode(payload, secrete_key, algorithm="HS256")

        return token.decode('utf-8')
        
    def IsAvailable(self, RefreshToken):
        try:
            token = self.DecodeRefreshToken(RefreshToken)
            exp_time = token['exp']
            return datetime.fromtimestamp(exp_time) > timezone.now()
        except jwt.ExpiredSignatureError or jwt.InvalidAlgorithmError:
            return False

    def ValidateAndRefresh(self, RefreshToken):
        try:
            decode = self.DecodeRefreshToken(RefreshToken)
            check = self.IsAvailable(RefreshToken)
            if not check: return None

            user_id = decode['user_id']
            new_access_token = self.GenerateAccessToken(user_id)
            return new_access_token
        except jwt.ExpiredSignatureError:
        # Handle expired refresh token
            return None
        except jwt.InvalidTokenError:
        # Handle invalid refresh token
            return None

    