import { assertsBodySchemaPresenceHook, assertsParamsSchemaPresenceHook, assertsQuerySchemaPresenceHook, assertsResponseSchemaPresenceHook, myErrorHandler, server } from '../../../lib/fastify'
import { userRequest } from '../../../schemas/user-request';
import { FromSchema } from 'json-schema-to-ts';
import { myChai, myDatasource, testPassword } from '../../helpers.spec';
import { User } from '../../../entities/user';
import fastify from 'fastify';

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
            const userInDB = await myDatasource.getRepository(User).findOne({ where: { email: payload.email } });
            myChai.expect(userInDB).to.have.property('id')
            myChai.expect(userInDB).to.contains({
                firstname: payload.firstname,
                lastname: payload.lastname,
                email: payload.email,
            });
        })
        it('should throw an error if sending too many properties for an user', async () => {
            const payload = {
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@domain.tld",
                password: testPassword,
                passwordConfirmation: testPassword,
                foo: 'bar'
            };
            const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload });
            myChai.expect(response.statusCode).to.equal(400);
        })
        it('should throw error on registering an unsafe route', () => {
            const server = fastify().addHook('onRoute', assertsResponseSchemaPresenceHook);
            myChai.expect(() =>
                server.route(
                    {
                        method: 'GET',
                        url: '/hello-world',
                        handler: (_, reply) => { reply.send('Hello world!') }
                    })
            ).to.throw('Missing schema on response for route /hello-world');
        })
        it('should throw error on registering a route without body schema', () => {
            const server = fastify().addHook('onRoute', assertsBodySchemaPresenceHook);
            myChai.expect(() =>
                server.route(
                    {
                        method: 'POST',
                        url: '/hello-world',
                        handler: (_, reply) => { reply.send('Hello world!') }
                    })
            ).to.throw('Missing schema on request body for route /hello-world');
        })
        it('should throw error on registering a route without querystring schema', () => {
            const server = fastify().addHook('onRoute', assertsQuerySchemaPresenceHook);
            myChai.expect(() =>
                server.route(
                    {
                        method: 'POST',
                        url: '/hello-world',
                        handler: (_, reply) => { reply.send('Hello world!') }
                    })
            ).to.throw('Missing schema on query for route /hello-world');
        })
        it('should throw error on registering a route without params schema', () => {
            const server = fastify().addHook('onRoute', assertsParamsSchemaPresenceHook);
            myChai.expect(() =>
                server.route(
                    {
                        method: 'POST',
                        url: '/hello-world',
                        handler: (_, reply) => { reply.send('Hello world!') }
                    })
            ).to.throw('Missing schema on params for route /hello-world');
        })
        it("it should return Internal Server Error on 500", async () => {
            const server = fastify().setErrorHandler(myErrorHandler);
            server.route(
                {
                    method: 'POST',
                    url: '/hello-world',
                    handler: () => { throw new Error("Error: Hello world!") }
                }
            );
            const response = await server.inject({ url: `/hello-world`, method: 'POST' });
            myChai.expect(response.statusCode).to.equal(500);
            myChai.expect(response.json()).to.have.property('message').and.to.equal("Internal Server Error");
        })
        it("it should return 400 on invalid user", async () => {
            const payload = {
                firstname: "John",
                lastname: "",
                email: "john.doe@domain.tld",
                password: testPassword,
                passwordConfirmation: testPassword,
            };
            const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload })
            myChai.expect(response.statusCode).to.equal(400);
            myChai.expect(response.json()).to.deep.include({
                constraints: {
                    isNotEmpty: "lastname should not be empty"
                },
                error: "Bad Request",
                property: "lastname",
                object: {
                    email: "john.doe@domain.tld",
                    firstname: "John",
                    lastname: ""
                }
            })
        })
    })
})