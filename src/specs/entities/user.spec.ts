import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { AppDataSource } from '../../data-source'
import { DataSource } from 'typeorm'
import { User } from '../../entity/User'

chai.use(chaiAsPromised)

describe('User', () => {
    const datasource: DataSource = AppDataSource();
    before(async () => {
        await datasource.initialize();
    });

    beforeEach(async () => {
        await datasource.getRepository(User).clear();
    });

    describe('validations', () => {
        it('should create a new User in database', async () => {
            const user = new User();
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.email = 'john.doe@domain.tld';
            user.passwordHash = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
            await datasource.getRepository(User).save(user);
            const userInDB = await datasource.getRepository(User).findOne({ where: { firstname: user.firstname } });
            chai.expect(userInDB).eql(user);
        });
        it('should raise error if email is missing', async function () {
            // hint to check if a promise fails with chai + chai-as-promise:
            // await chai.expect(promise).to.eventually.be.rejectedWith(QueryFailedError, "message")
        })
    })
})