import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { Session } from "../../entities/session";
import { User } from "../../entities/user";
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
            const sessionRepository = AppDataSource.getRepository(Session);
            const session = sessionRepository.create();
            session.user = user;
            await sessionRepository.save(session);
            await reply.status(201).setCookie('token', session.token, {
                signed: true,
                path: '/',
                expires: session.revokedAt,
                httpOnly: true,
                secure: true
            }).send();
        },
    );
}