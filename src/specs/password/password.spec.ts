import { buildUserFixture } from "../fixtures/users-fixtures.spec";
import { myChai } from "../helpers.spec";

describe('Password', () => {
    describe('validations', () => {
        it('should raise an error if user has not matching passwords', async () => {
            const user = buildUserFixture();
            await myChai.expect(user.setPassword({
                password: 'changeThat', passwordConfirmation: 'changeThis'
            })).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'passwordHash',
                constraints: { passwordsDoNotMatch: 'the two passwords do not match' }
            });
        });
        it('should raise an error if user has weak password', async () => {
            const user = buildUserFixture();
            await myChai.expect(user.setPassword({ password: 'miaou', passwordConfirmation: 'miaou' })).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: 'passwordHash',
                constraints: { passwordNotSecure: 'the password is not secure enough' }
            });
        });
        it('should be true if password is correct', async () => {
            const user = buildUserFixture();
            await myChai.expect(user.isPasswordValid("changethat")).to.eventually.be.true;
        });
    });
});