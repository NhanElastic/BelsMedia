from django.core.management.base import BaseCommand
from User.models import RefreshToken
from django.utils import timezone

class Command(BaseCommand):
    help = 'Delete expired refresh tokens'

    def handle(self, *args, **options):
        RefreshToken.objects.filter(expired_at = timezone.now()).delete()
