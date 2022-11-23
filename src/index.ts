import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { User } from './entity/user';

(async () => {
    const datasource = AppDataSource();
    await datasource.initialize();
})();
