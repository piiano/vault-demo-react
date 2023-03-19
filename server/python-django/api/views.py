import json
import logging
from functools import wraps

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Customer, User
from . import vault

logging.basicConfig(level=logging.INFO)

######## Parsing of auth "token"
MAGIC_BEGIN = "TOKEN"
MAGIC_END = "SIGNATURE"
BEARER = "Bearer"
def generate_token(id, email):
    return f"{MAGIC_BEGIN}_{id}_{email}_{MAGIC_END}"

def parse_token(token):
    assert token.startswith(BEARER)
    begin, id, email, end = token.split(" ")[1].split("_")
    assert begin == MAGIC_BEGIN and end == MAGIC_END
    return id

def parse_auth(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        auth = request.META.get("HTTP_AUTHORIZATION")
        if auth:
            id = parse_token(auth)
            kwargs['user_id'] = id
            role = User.objects.get(id=id).role
            kwargs['role'] = role
        else:
            kwargs['user_id'] = None
            kwargs['role'] = ""
        return func(request, *args, **kwargs)
    return wrapper

######## Login
@require_http_methods(["POST"])
@csrf_exempt
def tokens(request):
    request.POST = json.loads(request.body)
    email = request.POST.get('email')
    id = User.objects.get(email=email).id
    return JsonResponse( {"token": generate_token(id, email)})

######## List users (for the demo)
@require_http_methods(["GET"])
@csrf_exempt
def users(request):
    users = User.objects.values()
    return JsonResponse(list(users), safe=False)


######## Customers management
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

    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        customers = [vault.decrypt_object(customer) for customer in customers]

    return JsonResponse(list(customers), safe=False)

def create_customer(request, user_id):
    request.POST = json.loads(request.body)
    owner = User.objects.get(id=user_id)
    request.POST["owner_id"] = owner.pk
    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        request.POST = vault.encrypt_object(request.POST)

    customer = Customer.objects.create(**request.POST)
    customer_res = Customer.objects.values().get(pk=customer.pk)
    return JsonResponse(customer_res, safe=False)

######## Per customer
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
    logging.info(f"saving {request.POST}")
    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        request.POST = vault.encrypt_object(request.POST)
    customer.__dict__.update(request.POST)
    customer.save()
    
    customer_res = Customer.objects.values().get(pk=customer.pk)
    return JsonResponse(customer_res, safe=False)

def get_customer(request, pk):
    customer = Customer.objects.values().get(pk=pk)
    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        customer = vault.decrypt_object(customer)
    return JsonResponse(customer, safe=False)


def delete_customer(request, pk):
    customer = Customer.objects.get(pk=pk)
    customer.delete()
    return JsonResponse({'message': 'Customer deleted successfully'})



######## Profile management
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


