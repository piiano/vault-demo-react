{
    "name": "SSN_PROT",
    "base_type_name": "SSN",
    "description": "Protected SSN",
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