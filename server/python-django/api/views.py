import json
from functools import wraps

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Customer, User


def parse_auth(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        auth = request.META.get("HTTP_AUTHORIZATION")
        if auth:
            id = auth.split()[1]
            kwargs['user_id'] = id
            role = User.objects.get(id=id).role
            kwargs['role'] = role
        else:
            kwargs['user_id'] = None
            kwargs['role'] = ""
        return func(request, *args, **kwargs)
    return wrapper

@require_http_methods(["GET", "POST"])
@csrf_exempt
@parse_auth
def customers(request, user_id, role):
    if request.method == 'GET':
        return get_customers(request, user_id, role)
    elif request.method == 'POST':
        return create_customer(request, user_id)

def get_customers(request, user_id, role):
    if "support" == role:
        customers = Customer.objects.values()
    else:  
        customers = Customer.objects.values().filter(owner__id=user_id)
    return JsonResponse(list(customers), safe=False)

def create_customer(request, user_id):
    request.POST = json.loads(request.body)
    owner = User.objects.get(id=user_id)
    request.POST["owner_id"] = owner.pk
    customer = Customer.objects.create(**request.POST)
    customer_res = Customer.objects.values().get(pk=customer.pk)
    return JsonResponse(customer_res, safe=False)

@require_http_methods(["PUT", "DELETE",  "GET"])
@csrf_exempt
def customer(request, pk):
    if request.method == 'PUT':
        return update_customer(request, pk)
    elif request.method == 'DELETE':
        return delete_customer(request, pk)
    elif request.method == 'GET':
        return get_customer(request, pk)

def update_customer(request, pk):
    customer = Customer.objects.get(pk=pk)
    request.POST = json.loads(request.body)
    customer.name = request.POST.get('name')
    customer.email = request.POST.get('email')
    customer.ssn = request.POST.get('ssn')
    customer.save()
    
    customer_res = Customer.objects.values().get(pk=customer.pk)
    return JsonResponse(customer_res, safe=False)

def get_customer(request, pk):
    customer = Customer.objects.values().get(pk=pk)
    return JsonResponse(customer, safe=False)


def delete_customer(request, pk):
    customer = Customer.objects.get(pk=pk)
    customer.delete()
    return JsonResponse({'message': 'Customer deleted successfully'})


@require_http_methods(["GET", "PUT"])
@csrf_exempt
@parse_auth
def profile(request, user_id, role):
    if request.method == 'PUT':
        return update_profile(request, user_id)
    elif request.method == 'GET':
        return get_profile(request, user_id)

def get_profile(request, user_id):
    user = User.objects.values().get(id=user_id)
    return JsonResponse(user, safe=False)

def update_profile(request, user_id):
    request.POST = json.loads(request.body)
    User.objects.filter(id=user_id).update(**request.POST)
    users = User.objects.values().get(id=user_id)
    return JsonResponse(users, safe=False)

@require_http_methods(["POST"])
@csrf_exempt
def tokens(request):
    request.POST = json.loads(request.body)
    email = request.POST.get('email')
    id = User.objects.get(email=email).id
    return JsonResponse( {"token": id})

@require_http_methods(["GET"])
@csrf_exempt
def users(request):
    users = User.objects.values()
    return JsonResponse(list(users), safe=False)
