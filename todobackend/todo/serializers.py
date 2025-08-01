from rest_framework import serializers
from .models import Todo
from django import forms

class AddTodoSerializer(serializers.ModelSerializer):
    # todo=serializers.CharField(max_length=255)
    # created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model=Todo
        fields=('id','title','completed','priority','starred','created')
        widgets = {
            'my_datetime': forms.DateTimeInput(format='%d-%m-%Y %H:%M:%S', attrs={
                'type': 'datetime-local'
            }),
        }
        
class ListTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Todo
        fields=('id','title','completed','priority','starred','created')
        
        
class UpdataTodoSerializer(serializers.ModelSerializer):
    title=serializers.CharField(max_length=255)
    class Meta:
        model=Todo
        fields=('title','priority')
   
class CompleteStatusSerializer(serializers.ModelSerializer):
    completed=serializers.BooleanField()
    starred=serializers.BooleanField()
    class Meta:
        model=Todo
        fields=('completed','starred')