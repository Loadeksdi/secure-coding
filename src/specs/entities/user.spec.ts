import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/user'

chai.use(chaiAsPromised)

const testPassword = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';

const buildUser = async (email: string): Promise<User> => {
    const user = new User();
    const password = testPassword;
    user.firstname = 'John';
    user.lastname = 'Doe';
    await user.setPassword({ password, passwordConfirmation: password });
    user.email = email;
    return user;
};

describe('User', () => {
    const datasource = AppDataSource;

    before(async () => {
        await datasource.initialize();
    });

    beforeEach(async () => {
        await datasource.getRepository(User).clear();
    });

    describe('validations', () => {
        it('should create a new User in database', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await datasource.getRepository(User).save(user);
            const userInDB = await datasource.getRepository(User).findOne({ where: { firstname: user.firstname } });
            chai.expect(userInDB).deep.equal(user);
        });
        it('should raise error if email is missing', async function () {
            const repo = datasource.getRepository(User);
            const user = await buildUser('');
            await chai.expect(repo.save(user)).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'email',
                constraints: {
                    isEmail: 'email must be an email',
                    isNotEmpty: 'email should not be empty'
                }
            });
        });
        it('should raise error if email is already taken', async () => {
            const repo = datasource.getRepository(User);
            const user1 = await buildUser('john.doe@domain.tld');
            await repo.save(user1);
            const user2 = await buildUser('john.doe@domain.tld');
            await chai.expect(repo.save(user2)).to.eventually.be.rejected.and.deep.include({
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
            await datasource.getRepository(User).save(user);

            let now = Date.now();
            const userInDB1 = await datasource.getRepository(User).findOne({ where: { email: user.email } });
            const time1 = Date.now() - now;
            now = Date.now();
            const userInDB2 = await datasource.getRepository(User).findOne({ where: { id: user.id } });
            const time2 = Date.now() - now;

            chai.expect(userInDB1).deep.equal(user);
            chai.expect(userInDB2).deep.equal(user);
            chai.expect(time2).to.be.lessThanOrEqual(time1 + 1);
        });
        it('should save user with lowercase email', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await datasource.getRepository(User).save(user);

            const userInDB = await datasource.getRepository(User).findOne({ where: { email: user.email } });

            chai.expect(userInDB?.email).to.be.equal(user.email.toLowerCase());
        });
        it('should raise an error if user has not matching passwords', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await chai.expect(user.setPassword({
                password: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86', passwordConfirmation: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86etnon'
            })).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'passwordHash',
                constraints: { passwordsDoNotMatch: 'the two passwords do not match' }
            });
        });
    });
    it('should raise an error if user has weak password', async () => {
        const user = await buildUser('john.doe@domain.tld');
        await chai.expect(user.setPassword({ password: 'miaou', passwordConfirmation: 'miaou' })).to.eventually.be.rejected.and.deep.include({
            target: user,
            property: 'passwordHash',
            constraints: { passwordNotSecure: 'the password is not secure enough' }
        });
    });
    it('should be true if password is correct', async () => {
        const user = await buildUser('john.doe@domain.tld');
        await chai.expect(user.isPasswordValid(testPassword)).to.eventually.be.true;
    });
});