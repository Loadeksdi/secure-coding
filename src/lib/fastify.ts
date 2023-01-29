/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ValidationError } from 'class-validator';
import fastify, { FastifyError, FastifyReply, FastifyRequest, RouteOptions } from 'fastify'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import { EntityNotFoundError } from 'typeorm';
import { webApiRoutes } from '../routes/web-api/web-api-routes'
import { getEnvs } from './dotenv'

export const assertsResponseSchemaPresenceHook = (routeOptions: RouteOptions) => {
    const schema = routeOptions.schema;
    if (!schema?.response) {
        throw new Error(`Missing schema on response for route ${routeOptions.url}`)
    }
}

export const assertsBodySchemaPresenceHook = (routeOptions: RouteOptions) => {
    const schema = routeOptions.schema;
    if (!schema?.body) {
        throw new Error(`Missing schema on request body for route ${routeOptions.url}`)
    }
}

export const assertsQuerySchemaPresenceHook = (routeOptions: RouteOptions) => {
    const schema = routeOptions.schema;
    if (!schema?.querystring) {
        throw new Error(`Missing schema on query for route ${routeOptions.url}`)
    }
}

export const assertsParamsSchemaPresenceHook = (routeOptions: RouteOptions) => {
    const schema = routeOptions.schema;
    if (!schema?.params) {
        throw new Error(`Missing schema on params for route ${routeOptions.url}`)
    }
}

const removeDangerousProperties = (obj: any) => {
    // Example of properties that could be in the object, another appropriate way would be to
    // make entities implement an interface that would have a method to remove the properties
    const dangerousProperties = ["password", "passwordHash", "passwordSalt", "passwordResetToken", "token"];
    for (const dangerousProperty of dangerousProperties) {
        if (obj[dangerousProperty] !== undefined) {
            delete obj[dangerousProperty];
        }
    }
    return obj;
}

export const myErrorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ValidationError) {
        return reply.status(400).send({
            error: "Bad Request",
            object: removeDangerousProperties(error.target),
            property: error.property,
            constraints: error.constraints
        });
    }
    if (error instanceof EntityNotFoundError) {
        return reply.status(404).send({
            error: "Not Found",
            request,
            message: error.message,
        })
    }
    if (!error.statusCode || error.statusCode >= 500) {
        error.message = "Internal Server Error";
    }
    reply.send(error);
}

export const server = fastify({
    logger: getEnvs().FASTIFY_LOGGING === "true",
    ajv: {
        customOptions: {
            removeAdditional: false,
        }
    }
}).addHook('onRoute', assertsResponseSchemaPresenceHook)
    .addHook('onRoute', assertsBodySchemaPresenceHook)
    .addHook('onRoute', assertsQuerySchemaPresenceHook)
    .addHook('onRoute', assertsParamsSchemaPresenceHook)
    .setErrorHandler(myErrorHandler)
    .register(webApiRoutes, { prefix: '/web-api' })
    .register(cookie, {
        secret: getEnvs().cookieSecret,
        parseOptions: {}
    } as FastifyCookieOptions)
