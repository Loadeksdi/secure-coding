import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User } from "../../entities/user";
import { saveSession } from "../../lib/session";
import { AppDataSource } from "../../lib/typeorm";
import { empty } from "../../schemas/empty-object";
import { sessionRequest } from "../../schemas/session-request";
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
            await reply.status(201).send(user);
        },
    );
    fastify.post<{ Body: FromSchema<typeof sessionRequest> }>(
        '/sessions',
        {
            schema: {
                body: sessionRequest,
                response: 201,
                querystring: empty,
                params: empty
            }
        },
        async (request, reply): Promise<void> => {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { email: request.body.email.toLowerCase() } });
            if (!user) {
                await reply.status(404).send();
                return;
            }
            const validPassword = await user.isPasswordValid(request.body.password);
            if (!validPassword) {
                await reply.status(401).send();
                return;
            }
            await saveSession(reply, user);
        },
    );
    fastify.get<{ Reply: FromSchema<typeof userResponse> }>(
        '/users/me',
        {
            schema: {
                response: 200,
                querystring: empty,
                params: empty
            }
        },
        async (request, reply): Promise<void> => {
            const user = request.user;
            if (!request.session){
                await reply.status(401).send();
                return;
            }
            if (!user || (request.session?.revokedAt < new Date() || request.session?.expiredAt < new Date())) {
                await reply.status(401).send();
                return;
            }
            reply.send(user);
        },
    );
    fastify.delete<{ Reply: FromSchema<typeof empty> }>(
        '/sessions/current',
        {
            schema: {
                response: 204,
                querystring: empty,
                params: empty,
                body: empty
            },
        },
        async (request, reply): Promise<void> => {
            if (!request.session){
                await reply.status(401).send();
                return;
            }
            request.session.revokedAt = new Date();
            await AppDataSource.getRepository(User).save(request.session);
            await reply.status(204).send();
        },
    );
}