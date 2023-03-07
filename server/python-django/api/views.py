import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Customer

@require_http_methods(["GET", "POST"])
@csrf_exempt
def customers(request):
    if request.method == 'GET':
        return get_customers(request)
    elif request.method == 'POST':
        return create_customer(request)

def get_customers(request):
    customers = Customer.objects.all()
    customer_list = []
    for customer in customers:
        customer_list.append({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'ssn': customer.ssn
        })
    return JsonResponse(customer_list, safe=False)

def create_customer(request):
    request.POST = json.loads(request.body)
    name = request.POST.get('name')
    email = request.POST.get('email')
    ssn = request.POST.get('ssn')
    print(request)
    customer = Customer.objects.create(name=name, email=email, ssn=ssn)
    return JsonResponse({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'ssn': customer.ssn
    })

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
    return JsonResponse({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'ssn': customer.ssn
    })

def get_customer(request, pk):
    customer = Customer.objects.get(pk=pk)
    return JsonResponse({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'ssn': customer.ssn
    })

def delete_customer(request, pk):
    customer = Customer.objects.get(pk=pk)
    customer.delete()
    return JsonResponse({'message': 'Customer deleted successfully'})

