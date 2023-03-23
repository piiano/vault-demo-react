exports = {
    "idor_mask": {
        type: "transformer",
        description: "Returns the value with the last 4 characters masked",
        handler: idor_mask_handler,
        dependencies: {
            properties: ["owner_id"],
        }
    },
}

function validate_token (token) {
    // "Validation" of the token + extraction of the user_id this token belongs to
    const user_id = token.split(" ")[1].split("_")[1];  // Bearer TOKEN_2_alice@star.com_SIGNATURE
    return user_id;
}

function mask_ssn(ssn, char='x') {
    mask = ssn.replace(/^(\d{3})(.)\d{2}/g, Array(4).join(char) + "-" + Array(3).join(char))
    return mask
}

function idor_mask_handler(context, object, value) {
    const user_id = validate_token(context.param)

    if (user_id == object.owner_id) {
        return value;
    }
    return mask_ssn(value);
}