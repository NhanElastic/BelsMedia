from django.shortcuts import render, redirect
from rest_framework.views import APIView
from User.models import UserProfile, RefreshToken
# Create your views here.
class Home(APIView):
    def get(self, request):
        token = request.session.get('access_token')
        data = RefreshToken.DecodeAccessToken(token)
        print(data)
        userid = data['user_id']
        if userid:
            try:    
                user = UserProfile.objects.get(id=userid)
                context = {
                    'user': user
                }
            except UserProfile.DoesNotExist:
                return redirect('/login')
        else: context = {'user': None}
        return render(request, 'home/Home.html', context)
    