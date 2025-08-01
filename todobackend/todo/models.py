from django.db import models
from django.utils import timezone
# Create your models here.
class Todo(models.Model):
    title=models.CharField(max_length=255)
    completed=models.BooleanField(default=False)
    priority=models.CharField(max_length=25,default='medium')
    created=models.DateTimeField(auto_now_add=True)
    def formatted_created_at(self):
        return self.created.strftime('%Y-%m-%d %H:%M:%S')

    starred=models.BooleanField(max_length=20,default=False)
    