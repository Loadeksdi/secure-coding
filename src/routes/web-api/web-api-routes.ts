import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User } from "../../entities/user";
import { AppDataSource } from "../../lib/typeorm";
import { empty } from "../../schemas/empty-object";
import { userRequest } from "../../schemas/user-request";
import { userResponse } from "../../schemas/user-response";

// eslint-disable-next-line @typescript-eslint/require-await
export const webApiRoutes = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: FromSchema<typeof userRequest>, Reply: FromSchema<typeof userResponse> }>(
        '/users',
        {
            schema: {
                body: userRequest,
                response: {
                    201: userResponse
                },
                querystring: empty,
                params: empty
            }
        },
        async (request, reply): Promise<void> => {
            const repo = AppDataSource.getRepository(User);
            const user = repo.create(request.body);
            await user.setPassword({ password: request.body.password, passwordConfirmation: request.body.passwordConfirmation });
            await repo.save(user);
            await reply.code(201).send(user);
        },
    );
}