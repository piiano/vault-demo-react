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

function idor_mask_handler(context, object, value) {
    var token = context.param; // Bearer TOKEN_2_alice@star.com_SIGNATURE
    var user_id = token.split(" ")[1].split("_")[1];

    //console.log("*****++", context);    
    //console.log("*****--", object);
    char = 'x'
    if (user_id != object.owner_id) {
        mask = value.replace(/^(\d{3})(.)\d{2}/g, Array(4).join(char) + "-" + Array(3).join(char))
        console.log("returning", mask)
        return mask
    }
    return value;
}