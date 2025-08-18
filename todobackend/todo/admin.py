from django.contrib import admin
from .models import Todo
@admin.register(Todo)

class TodoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'completed', 'created')
    search_fields = ('title',)
    list_filter = ('completed', 'created')
# Register your models here.
