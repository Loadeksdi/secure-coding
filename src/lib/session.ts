import { FastifyReply, FastifyRequest } from 'fastify'
import { Session } from '../entities/session'
import { User } from '../entities/user'
import { server } from './fastify'
import { AppDataSource } from './typeorm'

declare module 'fastify' {
    interface FastifyRequest {
        session?: Session | null
        user?: User | null
    }
}

export const saveSession = async (reply: FastifyReply, user: User) => {
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
}

export const loadSession = async (request: FastifyRequest) => {
    const cookie = request.cookies.token;
    if (!cookie) {
        return;
    }
    const cookieValid = server.unsignCookie(cookie);
    if (!cookieValid || !cookieValid.valid) {
        return;
    }
    const token = cookieValid.value;
    if (!token) {
        return;
    }
    const session = await AppDataSource.getRepository(Session).findOne({ relations: ['user'], where: { token } })
    if (!session) {
        return;
    }
    session.user.passwordHash = "";
    server.decorateRequest('user', session.user);
    server.decorateRequest('session', session);
}