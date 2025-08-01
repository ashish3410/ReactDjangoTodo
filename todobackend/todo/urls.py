from django.urls import path
from .views import AddTodoView,ListTodoView,UpdateTodoView,DeleteTodoView,CompletedStatusView
urlpatterns = [
    path('add/',AddTodoView.as_view(),name='add-todo'),
    path('list/',ListTodoView.as_view(),name='list-todo'),
    path('<int:pk>/update/',UpdateTodoView.as_view(),name='update-todo'),
    path('<int:pk>/delete/',DeleteTodoView.as_view(),name='todo-delete'),
    path('<int:id>/completed/',CompletedStatusView.as_view(),name='todo-completed')
]
