import { User } from '../../entities/user'
import { buildUserFixture } from '../fixtures/users-fixtures.spec';
import { myChai, myDatasource } from '../helpers.spec';

describe('User', () => {
    describe('validations', () => {
        it('should create a new User in database', async () => {
            const user = buildUserFixture({
                email: "john.doe@domain.tld"
            });
            await myDatasource.getRepository(User).save(user);
            const userInDB = await myDatasource.getRepository(User).findOne({ where: { firstname: user.firstname } });
            myChai.expect(userInDB).deep.equal(user);
        });
        it('should raise error if email is missing', async () => {
            const repo = myDatasource.getRepository(User);
            const user = buildUserFixture({
                email: ""
            });
            await myChai.expect(repo.save(user)).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'email',
                constraints: {
                    isEmail: 'email must be an email',
                    isNotEmpty: 'email should not be empty'
                }
            });
        });
        it('should raise error if email is already taken', async () => {
            const repo = myDatasource.getRepository(User);
            const user1 = buildUserFixture({
                email: "john.doe@domain.tld"
            });
            await repo.save(user1);
            const user2 = buildUserFixture({
                email: "john.doe@domain.tld"
            });
            await myChai.expect(repo.save(user2)).to.eventually.be.rejected.and.deep.include({
                target: user2,
                property: 'email',
                constraints: {
                    EntityAlreadyExistsConstraint: 'email already exists'
                }
            });
        });
        it('should save user with lowercase email', async () => {
            const user = buildUserFixture();
            await myDatasource.getRepository(User).save(user);

            const userInDB = await myDatasource.getRepository(User).findOne({ where: { email: user.email } });

            myChai.expect(userInDB?.email).to.be.equal(user.email.toLowerCase());
        });
    });
});