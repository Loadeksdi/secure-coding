import { AppDataSource } from "../lib/typeorm";
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

export const myChai = chai.use(chaiAsPromised)
export const myDatasource = AppDataSource;

before(async () => {
    await myDatasource.initialize();
});

beforeEach(async () => {
    await resetDatabase();
});

after(async () => {
    await resetDatabase();
    await myDatasource.destroy();
});

export const resetDatabase = async () => {
    const entitiesMetadata = myDatasource.entityMetadatas;
    for (const entityMetadata of entitiesMetadata) {
        const repository = myDatasource.getRepository(entityMetadata.name);
        await repository.query(`TRUNCATE "${entityMetadata.tableName}" RESTART IDENTITY CASCADE;`);
    }
}
