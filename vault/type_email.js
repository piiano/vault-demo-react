{
    "name": "EMAIL_PROT",
    "base_type_name": "EMAIL",
    "description": "Protected email",
    "transformers": [
        {
            "bundle": "bundle",
            "function": "idor_mask"
        }
    ],
    "default_transformer": {
      "bundle": "bundle",
      "function": "idor_mask"
    }
}