import json
import logging
import time

from django.shortcuts import render
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Customer, User
from .auth import generate_token, parse_auth, ROLE_SUPPORT
from . import vault

logging.basicConfig(level=logging.INFO)

######## Login
@require_http_methods(["POST"])
@csrf_exempt
def tokens(request):
    request.POST = json.loads(request.body)
    email = request.POST.get('email')
    user = User.objects.get(email=email)
    return JsonResponse( {"token": generate_token(user.id, user.role, email)})

######## List users (for the demo)
@require_http_methods(["GET"])
@csrf_exempt
def users(request):
    users = User.objects.values()
    return JsonResponse(list(users), safe=False)


######## Customers management
def parse_expiration(request):
    expiration_secs = request.POST.get("expiration")
    if expiration_secs:
        expiration_secs = int(expiration_secs-time.time())
    return expiration_secs

@require_http_methods(["GET", "POST"])
@csrf_exempt
@parse_auth
def customers(request, user_id, role):
    if request.method == 'GET':
        return get_customers(request, user_id, role)
    elif request.method == 'POST':
        return create_customer(request, user_id, role)

def get_customers(request, user_id, role):
    if ROLE_SUPPORT == role:
        customers = Customer.objects.values()
    else:  
        customers = Customer.objects.values().filter(owner_id=user_id)

    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        customers = [vault.decrypt_object(customer, request.META.get("HTTP_AUTHORIZATION")) for customer in customers]

    return JsonResponse(list(customers), safe=False)

def create_customer(request, user_id, role):
    request.POST = json.loads(request.body)
    expiration_secs = parse_expiration(request)

    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        try:
            request.POST = vault.encrypt_object(request.POST, user_id, expiration_secs)
        except Exception as e:
            return JsonResponse({"message": "Bad format", "errors": e.args[0]}, status=422)

    request.POST["owner_id"] = user_id
    customer = Customer.objects.create(**request.POST)
    customer_res = Customer.objects.values().get(pk=customer.pk)
    return JsonResponse(customer_res, safe=False)

######## Per customer
@require_http_methods(["PATCH", "DELETE",  "GET"])
@parse_auth
@csrf_exempt
def customer(request, pk, user_id, role):
    if request.method == 'PATCH':
        return update_customer(request, pk, user_id, role)
    elif request.method == 'DELETE':
        return delete_customer(request, pk, user_id, role)
    elif request.method == 'GET':
        return get_customer(request, pk, user_id, role)

def update_customer(request, pk, user_id, role):
    customer = Customer.objects.get(pk=pk)
    if str(customer.owner_id) != user_id and role != ROLE_SUPPORT:
        return HttpResponseForbidden()    
    
    request.POST = json.loads(request.body)
    expiration_secs = parse_expiration(request)
    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        customer_data = vault.decrypt_object(customer.__dict__, request.META.get("HTTP_AUTHORIZATION"))
        customer_data.update(request.POST)
        logging.info(customer_data)
        try:
            request.POST.update(vault.encrypt_object(customer_data, customer.owner_id, expiration_secs))
        except Exception as e:
            return JsonResponse({"message": "Bad format", "errors": e.args[0]}, status=422)
        
    logging.info(f"updating {request.POST}")
    customer.__dict__.update(request.POST)
    customer.save()
    
    return JsonResponse({'message': 'Customer updated successfully'})

def get_customer(request, pk, user_id, role):
    customer = Customer.objects.values().get(pk=pk)
    # IDOR bug - missing ownership check

    if request.META.get("HTTP_X_VAULT_MODE") == "secure":
        customer = vault.decrypt_object(customer, request.META.get("HTTP_AUTHORIZATION"))
    return JsonResponse(customer, safe=False)


def delete_customer(request, pk, user_id, role):
    customer = Customer.objects.get(pk=pk)
    if str(customer.owner_id) != user_id and role != ROLE_SUPPORT:
        return HttpResponseForbidden()

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
    return JsonResponse({'message': 'Profile updated successfully'})


