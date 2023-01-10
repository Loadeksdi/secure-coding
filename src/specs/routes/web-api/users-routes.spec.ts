import { UserDTO } from '../../../dto/user-dto'
import { server } from '../../../lib/fastify'
import { buildUser } from '../../entities/user.spec'
import * as chai from 'chai'

describe('/web-api/users', function () {
    describe('POST #create', function () {
        it('should register the user', async function () {
            const payload = await buildUser('john.doe@domain.tld');
            const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload });
            const user: UserDTO = response.json();
            chai.expect(response.statusCode).to.equal(201);
            chai.expect(user.id).to.be.a('string');
            chai.expect(user).to.deep.equal({
                firstname: payload.firstname,
                lastname: payload.lastname,
                email: payload.email
            });

        })
    })
})