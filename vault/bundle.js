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
    if (!token) return null;
    // "Validation" of the token + extraction of the user_id this token belongs to
    const user_id = token.split(" ")[1].split("_")[1];  // Bearer TOKEN_2_member_alice@star.com_SIGNATURE
    const role = token.split(" ")[1].split("_")[2];  // Bearer TOKEN_2_member_alice@star.com_SIGNATURE
    return [user_id, role];
}

function mask(input, type, char='*') {
    switch(type) {
        case 'ssn':
            return input.replace(/^(\d{3})-(\d{2})/, `${char.repeat(3)}-${char.repeat(2)}`);
        case 'email':
            let [firstPart, domain] = input.split("@");
            if (firstPart.length > 1) {
                return firstPart[0] + char.repeat(firstPart.length - 1) + "@" + domain;
            } else {
                return firstPart + "@" + domain;
            }
        case 'name':
            let [firstName, lastName] = input.split(" ");
            if (lastName) {
                return firstName + " " + lastName[0] + ".";
            } else {
                return firstName;
            }
        default:
            return input;
    }
}


function idor_mask_handler(context, object, value) {
    const [user_id, role] = validate_token(context.param)

    if (user_id == object.owner_id) {
        return value;
    }
    if (role === 'support') {
        return value;
    }
    
    return mask(value, context.prop);
}