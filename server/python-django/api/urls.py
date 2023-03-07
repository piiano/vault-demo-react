from django.urls import path
from . import views

urlpatterns = [
    path('customers/', views.customers, name='customers'),
    path('customers/<int:pk>/', views.customer, name='customer'),
]
