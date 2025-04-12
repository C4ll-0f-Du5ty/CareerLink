from django.core.management.base import BaseCommand
from users.models import ChatMessage

class Command(BaseCommand):
    help = 'Clear all chat messages'

    def handle(self, *args, **kwargs):
        deleted, _ = ChatMessage.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted} chat messages.'))
