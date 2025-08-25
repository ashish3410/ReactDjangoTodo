from rest_framework import serializers
from .models import Todo
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class AddTodoSerializer(serializers.ModelSerializer):
    # todo=serializers.CharField(max_length=255)
    # created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model=Todo
        fields=('id','title','completed','priority','starred','created_at','created_by')
        widgets = {
            'my_datetime': forms.DateTimeInput(format='%d-%m-%Y %H:%M:%S', attrs={
                'type': 'datetime-local'
            }),
        }
        
class ListTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Todo
        fields=('id','title','completed','priority','starred','created_at')
        
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