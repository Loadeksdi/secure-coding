import { User } from "../entities/user";
import { AppDataSource } from "../lib/typeorm";
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

export const myChai = chai.use(chaiAsPromised)
export const myDatasource = AppDataSource;

export const testPassword = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';

export const buildUser = async (email: string): Promise<User> => {
    const user = new User();
    const password = testPassword;
    user.firstname = 'John';
    user.lastname = 'Doe';
    await user.setPassword({ password, passwordConfirmation: password });
    user.email = email;
    return user;
};

before(async () => {
    await myDatasource.initialize();
});

beforeEach(async () => {
    await myDatasource.getRepository(User).clear();
});

after(async () => {
    await myDatasource.destroy();
});