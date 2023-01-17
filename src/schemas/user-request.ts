export const userRequest = {
    type: "object",
    properties: {
        firstname: {
            type: "string"
        },
        lastname: {
            type: "string"
        },
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        passwordConfirmation: {
            type: "string"
        }
    },
    required: ["firstname", "lastname", "email", "password", "passwordConfirmation"],
    additionalProperties: false
} as const;