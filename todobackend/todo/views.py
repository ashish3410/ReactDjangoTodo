from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Todo
from .serializers import AddTodoSerializer, ListTodoSerializer,UpdataTodoSerializer,CompleteStatusSerializer,UserRegistrationSerializer
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated ,AllowAny


def home(request):
    return JsonResponse({"message": "Django backend is live"})

class RegisterView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            print(token.key)
            return Response({
                'message': 'User registered successfully',
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'status': status.HTTP_201_CREATED
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'message': 'Login successful',
                    'token': token.key,
                    'user_id': user.id,
                    'email': user.email,
                    'status': status.HTTP_200_OK
                })
            else:
                return Response({
                    'message': 'Invalid credentials',
                    'status': status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'message': 'Username and password required',
            'status': status.HTTP_400_BAD_REQUEST
        }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({
                'message': 'Logout successful',
                'status': status.HTTP_200_OK
            })
        except:
            return Response({
                'message': 'Error logging out',
                'status': status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)


class AddTodoView(APIView):
    def post(self, request):
        serializer = AddTodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Todo added successfully', 'status': status.HTTP_200_OK})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListTodoView(APIView):
    def get(self,request):
        user=request.user
        queryset=Todo.objects.filter(created_by=user)
        serializer=ListTodoSerializer(queryset,many=True)
        return Response(serializer.data)
    
class UpdateTodoView(APIView):
    def put(self,request,pk):
        try:
            todo=Todo.objects.get(pk=pk)
            print(todo.title)
        except Todo.DoesNotExist:
            return Response({'error':'todo not found'},status=status.HTTP_400_BAD_REQUEST)
        serializer=UpdataTodoSerializer(todo,data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message':"updated succesully"})

class CompletedStatusView(APIView):
    def put(self,request,id):
        try:
            todo=Todo.objects.get(id=id)
            print(todo.title)
        except Todo.DoesNotExist:
            return Response({'error':'todo not found'},status=status.HTTP_404_NOT_FOUND)
        serializer=CompleteStatusSerializer(todo,data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message':'Status changed Successfully'},status.HTTP_202_ACCEPTED)
        
class DeleteTodoView(APIView):
    def delete(self,request,pk):
        try:
            todo=Todo.objects.get(pk=pk)
            todo.delete()
            return Response({'message':'todo deleted successfully'},status=status.HTTP_204_NO_CONTENT)
        except Todo.DoesNotExist:
            return Response({'error':'todo not found'},status=status.HTTP_404_NOT_FOUND)
        