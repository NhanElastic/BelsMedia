from django.shortcuts import render, redirect
from rest_framework.views import APIView
from User.models import UserProfile
# Create your views here.
class Home(APIView):
    def get(self, request):
        userid = request.session.get('user_id')
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