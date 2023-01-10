import { User } from "../entities/user";

export class UserDTO {
    id: string;
    email: string;
    firstname: string;
    lastname: string;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
    }
}