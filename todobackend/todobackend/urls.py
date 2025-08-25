
from django.contrib import admin
from django.urls import path,include
from todo.views import home
from todo import views
urlpatterns = [
    
    path('',home),
    path('admin/', admin.site.urls),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/todo/', include('todo.urls'))
]