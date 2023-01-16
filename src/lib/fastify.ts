import fastify from 'fastify'
import { FromSchema } from "json-schema-to-ts";
import { User } from '../entities/user';
import { userRequest } from '../schemas/user-request';
import { userResponse } from '../schemas/user-response';
import { AppDataSource } from './typeorm';

export const server = fastify();

server.post<{ Body: FromSchema<typeof userRequest>, Reply: FromSchema<typeof userResponse> }>(
    '/web-api/users',
    {
        schema: {
            body: userRequest,
            response: {
                201: {
                    userResponse
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
        const createdUser: FromSchema<typeof userResponse> = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        }
        await reply.code(201).send(createdUser);
    },
);