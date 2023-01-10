import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"
import { IsEmail, IsNotEmpty, IsString, MaxLength, ValidationError } from "class-validator"
import { UniqueInColumn } from "../decorators/unique-in-column"
import * as bcrypt from 'bcrypt';
import { PasswordDTO } from "../dto/password-dto";
import { isPasswordSecure } from "../helpers/password";
@Entity()
@Index("USER_EMAIL_INDEX", { synchronize: false })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    firstname!: string

    @Column()
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    lastname!: string

    @Column({
        transformer: {
            from: (value: string) => value,
            to: (value: string) => value.toLowerCase()
        }
    })
    @IsNotEmpty()
    @IsEmail()
    @UniqueInColumn()
    email!: string

    @Column()
    @IsNotEmpty()
    @IsString()
    @MaxLength(128)
    private passwordHash!: string

    async setPassword(passwordDto: PasswordDTO) {
        if (!passwordDto.password) {
            const emptyPasswordError = new ValidationError()
            emptyPasswordError.target = this;
            emptyPasswordError.property = 'passwordHash';
            emptyPasswordError.constraints = { emptyPassword: 'the password should not be empty' };
            throw emptyPasswordError;
        }
        if (passwordDto.password !== passwordDto.passwordConfirmation) {
            const passwordsDoNotMatchError = new ValidationError()
            passwordsDoNotMatchError.target = this;
            passwordsDoNotMatchError.property = 'passwordHash';
            passwordsDoNotMatchError.constraints = { passwordsDoNotMatch: 'the two passwords do not match' };
            throw passwordsDoNotMatchError;
        }
        if (!isPasswordSecure(passwordDto.password)) {
            const passwordNotSecureError = new ValidationError()
            passwordNotSecureError.target = this;
            passwordNotSecureError.property = 'passwordHash';
            passwordNotSecureError.constraints = { passwordNotSecure: 'the password is not secure enough' };
            throw passwordNotSecureError;
        }
        this.passwordHash = await bcrypt.hash(passwordDto.password, 10);
    }

    async isPasswordValid(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }

}