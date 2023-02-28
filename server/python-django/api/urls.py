from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^customers/?$', views.customers, name='customers'),
    re_path(r'^customers/(?P<pk>\w+)/?$', views.customer, name='customer'),
    re_path(r'^profile/?$', views.profile, name='profile'),
    re_path(r'^oauth/tokens/?$', views.tokens, name='tokens'),
    re_path(r'^users/?$', views.users, name='users'),
]
