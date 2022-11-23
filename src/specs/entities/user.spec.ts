import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { AppDataSource } from '../../data-source'
import { DataSource } from 'typeorm'
import { User } from '../../entities/user'
import { ValidationError } from '../../errors/validation'

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
            chai.expect(userInDB).deep.equal(user);
        });
        /*
        it('should raise error if email is missing', async function () {
            const user = new User();
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.passwordHash = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
            await chai.expect(datasource.getRepository(User).save(user)).to.eventually.be.rejectedWith(QueryFailedError);
        })*/
        it('should raise custom error if email is missing', async function () {
            const user = new User();
            user.firstname = 'John';
            user.lastname = 'Doe';
            user.passwordHash = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
            await chai.expect(datasource.getRepository(User).save(user)).to.eventually.be.rejectedWith(ValidationError, "The email is required")
            .and.include({ target: user, property: 'email' });
        });
    })
})