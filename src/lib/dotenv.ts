export const getEnvs = () => {
    const port = process.env.DB_PORT;
    const host = process.env.DB_HOST;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const FASTIFY_PORT = process.env.FASTIFY_PORT;
    const FASTIFY_ADDR = process.env.FASTIFY_ADDR;
    const FASTIFY_LOGGING = process.env.FASTIFY_LOGGING;
    const cookieSecret = process.env.COOKIE_SECRET;
    if (!port || !host || !username || !password || !database || !FASTIFY_PORT || !FASTIFY_ADDR || !FASTIFY_LOGGING || !cookieSecret) {
        throw new Error('Missing environment variables');
    }
    return { port, host, username, password, database, FASTIFY_PORT, FASTIFY_ADDR, FASTIFY_LOGGING, cookieSecret };
}
