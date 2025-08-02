from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Todo
from .serializers import AddTodoSerializer, ListTodoSerializer,UpdataTodoSerializer,CompleteStatusSerializer
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Django backend is live"})


class AddTodoView(APIView):
    def post(self, request):
        serializer = AddTodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Todo added successfully', 'status': status.HTTP_200_OK})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListTodoView(APIView):
    def get(self,request):
        todos=Todo.objects.all()
        serializer=ListTodoSerializer(todos,many=True)
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
        