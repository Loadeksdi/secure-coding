import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserSubscriber } from '../validators/user-subscriber';
import { getEnvs } from './dotenv';
dotenv.config()

export const AppDataSource = ((): DataSource => {
    const { port, host, username, password, database } = getEnvs();
    return new DataSource({
        type: "postgres",
        host,
        port: parseInt(port),
        username,
        password,
        database,
        synchronize: true,
        logging: true,
        entities: ['dist/entities/*.js'],
        subscribers: [UserSubscriber],
        migrations: [],
    })
})();