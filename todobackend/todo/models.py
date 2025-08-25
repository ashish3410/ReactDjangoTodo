from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.
class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos',null=True, blank=True)
    title=models.CharField(max_length=255)
    completed=models.BooleanField(default=False)
    priority=models.CharField(max_length=25,default='medium')
    created_at=models.DateTimeField(auto_now_add=True)
    def formatted_created_at(self):
        return self.created.strftime('%Y-%m-%d %H:%M:%S')
    created_by=models.CharField(max_length=255)
    starred=models.BooleanField(max_length=20,default=False)
    