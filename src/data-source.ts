import { DataSource } from 'typeorm';
import { User } from './entities/user';
import * as dotenv from 'dotenv';
import { UserSubscriber } from './validators/user-subscriber';
dotenv.config()

export const AppDataSource = (): DataSource => {
    const port = process.env.DB_PORT;
    const host = process.env.DB_HOST;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    if (!port || !host || !username || !password || !database) {
        throw new Error('Missing environment variables');
    }
    return new DataSource({
        type: "postgres",
        host,
        port: parseInt(port),
        username,
        password,
        database,
        synchronize: true,
        logging: true,
        entities: [User],
        subscribers: [UserSubscriber],
        migrations: [],
    })
};