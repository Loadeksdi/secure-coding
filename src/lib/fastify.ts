import fastify, { RouteOptions } from 'fastify'
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
.register(webApiRoutes, { prefix: '/web-api' })
