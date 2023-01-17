import { User } from '../../entities/user'
import { buildUser, myChai, myDatasource } from '../helpers.spec';

describe('User', () => {
    describe('validations', () => {
        it('should create a new User in database', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await myDatasource.getRepository(User).save(user);
            const userInDB = await myDatasource.getRepository(User).findOne({ where: { firstname: user.firstname } });
            myChai.expect(userInDB).deep.equal(user);
        });
        it('should raise error if email is missing', async () => {
            const repo = myDatasource.getRepository(User);
            const user = await buildUser('');
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
            const user1 = await buildUser('john.doe@domain.tld');
            await repo.save(user1);
            const user2 = await buildUser('john.doe@domain.tld');
            await myChai.expect(repo.save(user2)).to.eventually.be.rejected.and.deep.include({
                target: user2,
                property: 'email',
                constraints: {
                    EntityAlreadyExistsConstraint: 'email already exists'
                }
            });
        });
        // Questionnable performance test
        it('should fetch user by id as fast as by email', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await myDatasource.getRepository(User).save(user);

            let now = Date.now();
            const userInDB1 = await myDatasource.getRepository(User).findOne({ where: { email: user.email } });
            const time1 = Date.now() - now;
            now = Date.now();
            const userInDB2 = await myDatasource.getRepository(User).findOne({ where: { id: user.id } });
            const time2 = Date.now() - now;

            myChai.expect(userInDB1).deep.equal(user);
            myChai.expect(userInDB2).deep.equal(user);
            myChai.expect(time2).to.be.lessThanOrEqual(time1 + 1);
        });
        it('should save user with lowercase email', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await myDatasource.getRepository(User).save(user);

            const userInDB = await myDatasource.getRepository(User).findOne({ where: { email: user.email } });

            myChai.expect(userInDB?.email).to.be.equal(user.email.toLowerCase());
        });
    });
});