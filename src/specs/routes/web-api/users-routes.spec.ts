import { server } from '../../../lib/fastify'
import { userRequest } from '../../../schemas/user-request';
import { FromSchema } from 'json-schema-to-ts';
import { myChai, myDatasource, testPassword } from '../../helpers.spec';
import { User } from '../../../entities/user';

describe('/web-api/users', function () {
    describe('POST #create', function () {
        it('should register the user', async () => {
            const payload: FromSchema<typeof userRequest> = {
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@domain.tld",
                password: testPassword,
                passwordConfirmation: testPassword
            }
            const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload });
            myChai.expect(response.statusCode).to.equal(201);
            myChai.expect(response.json()).to.have.property('id')
            myChai.expect(response.json()).not.to.have.property('passwordHash')
            myChai.expect(response.json()).to.contains({
                firstname: payload.firstname,
                lastname: payload.lastname,
                email: payload.email,
            })
            const userInDB = await myDatasource.getRepository(User).findOne({ where: { email: payload.email }});
            myChai.expect(userInDB).to.have.property('id')
            myChai.expect(userInDB).to.contains({
                firstname: payload.firstname,
                lastname: payload.lastname,
                email: payload.email,
            });
        })
    })
})