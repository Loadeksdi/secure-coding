/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User } from '../../entities/user.js'
import { faker } from '@faker-js/faker'
import { AppDataSource } from '../../lib/typeorm.js'

type UserFixtureOptions = Partial<Pick<User, 'firstname' | 'lastname' | 'email'>>;

export function buildUserFixture(opts: UserFixtureOptions = {}) {
    const user = new User();
    user.firstname = opts.firstname ?? faker.name.firstName();
    user.lastname = opts.lastname ?? faker.name.lastName();
    user.email = opts.email ?? faker.internet.email();

    // that hash matches password 'changethat', hardcoded so we save CPU hashing time
    user.passwordHash = "$2a$12$dm2t30Y07Mt9TklkLOuy.efFIJ69WTW3f7NmwH8uioX9R6NHMQSXO";

    return user;
}

export function createUserFixture(opts: UserFixtureOptions = {}) {
    return AppDataSource.getRepository(User).save(buildUserFixture(opts));
}