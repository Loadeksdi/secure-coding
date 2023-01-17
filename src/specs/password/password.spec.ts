import { buildUser, myChai, testPassword } from "../helpers.spec";

describe('Password', () => {
    describe('validations', () => {
        it('should raise an error if user has not matching passwords', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await myChai.expect(user.setPassword({
                password: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86', passwordConfirmation: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86etnon'
            })).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'passwordHash',
                constraints: { passwordsDoNotMatch: 'the two passwords do not match' }
            });
        });
        it('should raise an error if user has weak password', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await myChai.expect(user.setPassword({ password: 'miaou', passwordConfirmation: 'miaou' })).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'passwordHash',
                constraints: { passwordNotSecure: 'the password is not secure enough' }
            });
        });
        it('should be true if password is correct', async () => {
            const user = await buildUser('john.doe@domain.tld');
            await myChai.expect(user.isPasswordValid(testPassword)).to.eventually.be.true;
        });
    });
});