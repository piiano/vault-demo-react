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
    console.log("*****++", context)
    console.log("*****--", object)
    return value + "_112222";
}