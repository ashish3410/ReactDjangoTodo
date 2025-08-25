from django.contrib import admin
from .models import Todo
@admin.register(Todo)

class TodoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'completed', 'created_at', 'created_by')
    search_fields = ('title',)
    list_filter = ('completed', 'created_by')
# Register your models here.
