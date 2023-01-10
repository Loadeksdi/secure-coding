import 'reflect-metadata';
import { getEnvs } from './lib/dotenv'
import { server } from './lib/fastify'
import { AppDataSource } from './lib/typeorm';

async function run() {
    await AppDataSource.initialize()
    const { FASTIFY_ADDR, FASTIFY_PORT } = getEnvs();
    await server.listen({ port: parseInt(FASTIFY_PORT), host: FASTIFY_ADDR })
}

run().catch(console.error)