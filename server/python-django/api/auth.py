from functools import wraps
from .models import User

ROLE_MEMBER = "member"
ROLE_SUPPORT = "support"

MAGIC_BEGIN = "TOKEN"
MAGIC_END = "SIGNATURE"
BEARER = "Bearer"
def generate_token(id, role, email):
    return f"{MAGIC_BEGIN}_{id}_{role}_{email}_{MAGIC_END}"

def parse_token(token):
    assert token.startswith(BEARER)
    try:
        begin, id, role, email, end = token.split(" ")[1].split("_")
        assert begin == MAGIC_BEGIN and end == MAGIC_END
    except:
        return None
    return id, role

def parse_auth(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        auth = request.META.get("HTTP_AUTHORIZATION")
        id = None
        if auth:
            id, role = parse_token(auth)
        if id:
            kwargs['user_id'] = id
            kwargs['role'] = role
        else:
            kwargs['user_id'] = None
            kwargs['role'] = ""
        return func(request, *args, **kwargs)
    return wrapper