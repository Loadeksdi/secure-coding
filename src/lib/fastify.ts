import fastify from 'fastify'
import { FromSchema } from "json-schema-to-ts";
import { UserDTO } from '../dto/user-dto';
import { User } from '../entities/user';
import { AppDataSource } from './typeorm';

export const server = fastify();

const userRequest = {
    "type": "object",
    "properties": {
        "firstname": {
            "type": "string"
        },
        "lastname": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        },
        "passwordConfirmation": {
            "type": "string"
        }
    },
    "required": ["firstname", "lastname", "email", "password", "passwordConfirmation"]
} as const;

const userResponse = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "firstname": {
            "type": "string"
        },
        "lastname": {
            "type": "string"
        }
    },
    "required": ["id", "email", "firstname", "lastname"]
} as const;

server.post<{ Body: FromSchema<typeof userRequest> }>(
    '/web-api/users',
    {
        schema: {
            body: userRequest,
            response: {
                201: {
                    type: 'string',
                },
            },
        }
    },
    async (request, reply): Promise<void> => {
        const user = new User();
        user.firstname = request.body.firstname;
        user.lastname = request.body.lastname;
        user.email = request.body.email;
        await user.setPassword({ password: request.body.password, passwordConfirmation: request.body.passwordConfirmation });
        const repo = AppDataSource.getRepository(User);
        await repo.save(user);
        //await reply.code(201).send(new UserDTO(user));
        await reply.code(201).send('miaou')
    },
);