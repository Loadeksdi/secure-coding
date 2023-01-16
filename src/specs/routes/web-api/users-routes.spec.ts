import { server } from '../../../lib/fastify'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { userRequest } from '../../../schemas/user-request';
import { FromSchema } from 'json-schema-to-ts';

chai.use(chaiAsPromised);

const securedPassword = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';

describe('/web-api/users', function () {
    describe('POST #create', function () {
        it('should register the user', async () => {
            const payload: FromSchema<typeof userRequest> = {
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@domain.tld",
                password: securedPassword,
                passwordConfirmation: securedPassword
            }
            const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload });
            chai.expect(response.statusCode).to.equal(201);
        })
    })
})