export const userResponse = {
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        email: {
            type: "string"
        },
        firstname: {
            type: "string"
        },
        lastname: {
            type: "string"
        }
    },
    required: ["id", "email", "firstname", "lastname"],
    additionalProperties: false
} as const;