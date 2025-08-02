
from django.contrib import admin
from django.urls import path,include
from todo.views import home
urlpatterns = [
    path('',home),
    path('admin/', admin.site.urls),
    path('api/todo/', include('todo.urls'))
]