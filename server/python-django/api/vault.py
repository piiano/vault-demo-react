import requests
import os

BASE_URL = os.environ.get("PVAULT_BASE_URL")
API_KEY = os.environ.get("PVAULT_ADMIN_API_KEY")

MAGIC_PREFIX = "ENC_"

def encrypt(data, field_name):
    if type(data) != str:
        return data
    url = f"{BASE_URL}/api/pvlt/1.0/data/collections/customers/encrypt/objects"

    querystring = {"reason":"AppFunctionality"}

    payload = [
        {
            "type":"deterministic",
            "object": {"fields": {field_name:data}},
        }
    ]
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    response = requests.request("POST", url, json=payload, headers=headers, params=querystring)
    if response.status_code == 200:
        resp = response.json()
        return MAGIC_PREFIX + resp[0]["ciphertext"]
    raise Exception(f"Can't encrypt data {response.json()}, {response.text}")

def decrypt(cipher, field_name):
    if type(cipher) != str or not cipher.startswith(MAGIC_PREFIX):
        return cipher
    cipher = cipher.lstrip(MAGIC_PREFIX)
    url = f"{BASE_URL}/api/pvlt/1.0/data/collections/customers/decrypt/objects"

    querystring = {"reason":"AppFunctionality"}

    payload = [
        {
            "encrypted_object": {"ciphertext":cipher},
        }
    ]
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer pvaultauth"
    }

    response = requests.request("POST", url, json=payload, headers=headers, params=querystring)
    resp = response.json()
    #print(cipher, resp)
    return resp[0]["fields"][field_name]

def encrypt_object(object):
    res = dict()
    for k,v in object.items():
        res[k] = encrypt(v, k)
    return res
def decrypt_object(object):
    res = dict()
    for k,v in object.items():
        res[k] = decrypt(v, k)
    return res