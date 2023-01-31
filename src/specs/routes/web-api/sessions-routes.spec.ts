import { FromSchema } from "json-schema-to-ts"
import { Session } from "../../../entities/session"
import { User } from "../../../entities/user"
import { server } from "../../../lib/fastify"
import { sessionRequest } from "../../../schemas/session-request"
import { createSessionFixture } from "../../fixtures/sessions-fixtures.spec"
import { createUserFixture } from "../../fixtures/users-fixtures.spec"
import { myChai, myDatasource } from "../../helpers.spec"

describe('/web-api/sessions', () => {
    describe('POST #create', () => {
        it('should create a session', async () => {
            const user = await createUserFixture();
            const userInDatabase = await myDatasource.getRepository(User).findOne({ where: { email: user.email } });
            if (!userInDatabase) throw new Error('User not found in database');
            const payload: FromSchema<typeof sessionRequest> = {
                email: user.email,
                password: "changethat",
            }
            const response = await server.inject({ url: `/web-api/sessions`, method: 'POST', payload });
            myChai.expect(response.statusCode).to.equal(201);
            const sessionInDB = await myDatasource.getRepository(Session).findOne(
                {
                    relations: ['user'],
                    where: {
                        user: {
                            id: userInDatabase.id
                        }
                    }
                }
            );
            myChai.expect(sessionInDB).to.have.property('id').and.to.be.a('string');
            myChai.expect(sessionInDB).to.have.property('token').and.to.be.a('string');
            myChai.expect(sessionInDB).to.have.property('user').and.to.be.a('object');
            myChai.expect(sessionInDB).to.have.property('createdAt').and.to.be.a('date');
            myChai.expect(sessionInDB).to.have.property('revokedAt').and.to.be.null;
            myChai.expect(sessionInDB).to.have.property('expiredAt').and.to.be.a('date');
        })
        it('should create a session after lowering email', async () => {
            const user = await createUserFixture({
                email: "SCREAMING.EMAIL@DOMAIN.TLD"
            });
            const userInDatabase = await myDatasource.getRepository(User).findOne({ where: { email: user.email.toLowerCase() } });
            if (!userInDatabase) throw new Error('User not found in database');
            const payload: FromSchema<typeof sessionRequest> = {
                email: user.email,
                password: "changethat",
            }
            const response = await server.inject({ url: `/web-api/sessions`, method: 'POST', payload });
            myChai.expect(response.statusCode).to.equal(201);
            const sessionInDB = await myDatasource.getRepository(Session).findOne(
                {
                    relations: ['user'],
                    where: {
                        user: {
                            id: userInDatabase.id
                        }
                    }
                }
            );
            myChai.expect(sessionInDB).to.have.property('id').and.to.be.a('string');
            myChai.expect(sessionInDB).to.have.property('token').and.to.be.a('string');
            myChai.expect(sessionInDB).to.have.property('user').and.to.be.a('object');
            myChai.expect(sessionInDB).to.have.property('createdAt').and.to.be.a('date');
            myChai.expect(sessionInDB).to.have.property('revokedAt').and.to.be.null;
            myChai.expect(sessionInDB).to.have.property('expiredAt').and.to.be.a('date');
        })
        it('should reject with 404 if email not found', async () => {
            await createUserFixture();
            const payload: FromSchema<typeof sessionRequest> = {
                email: "random.email@domain.tld",
                password: "changethat",
            }
            const response = await server.inject({ url: `/web-api/sessions`, method: 'POST', payload });
            myChai.expect(response.statusCode).to.equal(404);
        })
        it('should reject with 401 if password does not match', async () => {
            const user = await createUserFixture();
            const payload: FromSchema<typeof sessionRequest> = {
                email: user.email,
                password: "changethis",
            }
            const response = await server.inject({ url: `/web-api/sessions`, method: 'POST', payload });
            myChai.expect(response.statusCode).to.equal(401);
        })
    })
})
describe('/web-api/sessions/current', () => {
    describe('DELETE', () => {
        it('should delete the current session', async () => {
            const user = await createUserFixture();
            await createSessionFixture({ user });
            const userInDatabase = await myDatasource.getRepository(User).findOne({ where: { email: user.email } });
            if (!userInDatabase) throw new Error('User not found in database');
            const response = await server.inject({ url: `/web-api/sessions/current`, method: 'DELETE' });
            myChai.expect(response.statusCode).to.equal(204);
            const sessionInDB = await myDatasource.getRepository(Session).findOne(
                {
                    relations: ['user'],
                    where: {
                        user: {
                            id: userInDatabase.id
                        }
                    }
                }
            );
            myChai.expect(sessionInDB).to.have.property('id').and.to.be.a('string');
            myChai.expect(sessionInDB).to.have.property('token').and.to.be.a('string');
            myChai.expect(sessionInDB).to.have.property('user').and.to.be.a('object');
            myChai.expect(sessionInDB).to.have.property('createdAt').and.to.be.a('date');
            myChai.expect(sessionInDB).to.have.property('revokedAt').and.to.be.a('date');
            myChai.expect(sessionInDB).to.have.property('expiredAt').and.to.be.a('date');
        })
    })
})
