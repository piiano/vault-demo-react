import requests
import os
import logging

BASE_URL = os.environ.get("PVAULT_BASE_URL")
API_KEY = os.environ.get("PVAULT_ADMIN_API_KEY")

MAGIC_PREFIX = "ENC_"

def encrypt(data, field_name, owner_id, expiration_secs):
    if type(data) != str or len(data) == 0:
        return data
    url = f"{BASE_URL}/api/pvlt/1.0/data/collections/customers/encrypt/objects"

    querystring = {
        "reason":"AppFunctionality", 
        "expiration_secs": expiration_secs
    }

    payload = [
        {
            "type":"randomized",
            "object": {"fields": {field_name:data, "owner_id":int(owner_id)}},
        }
    ]
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    response = requests.request("POST", url, json=payload, headers=headers, params=querystring)
    resp = response.json()
    #logging.info(f"{response.status_code} {resp}")
    if response.status_code == 200:
        return MAGIC_PREFIX + resp[0]["ciphertext"]
    if response.status_code == 404 and resp["error_code"] == "PV3004": # Property does not exist.
        return data
    if response.status_code == 400 and resp["error_code"] == "PV3002":
        raise Exception("Bad format") 
    
    raise Exception({"status": response.status_code, "text": resp})

def decrypt(cipher, field_name, token):
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
        "Authorization": "Bearer pvaultauth",
        "X-Trans-Param": token
    }

    response = requests.request("POST", url, json=payload, headers=headers, params=querystring)
    resp = response.json()
    #logging.info(f"{response.status_code} {resp}")
    if response.status_code == 200:
        return resp[0]["fields"][field_name]
    if response.status_code == 400 and resp["error_code"] == "PV3233": #The encrypted object is archived
        return "[Archived]"

def encrypt_object(object, owner_id, expiration_secs = None):
    errors = dict()
    res = dict()
    for k,v in object.items():
        try:
            data = encrypt(v, k, owner_id, expiration_secs)
            res[k] = data
        except Exception as err:
            errors[k] = err.args[0]
    if errors:
        raise Exception(errors)
    return res
    
    return res
def decrypt_object(object, token):
    res = dict()
    for k,v in object.items():
        res[k] = decrypt(v, k, token)
    return res