import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"
import { UniqueInColumn } from "../decorators/unique-in-column"
@Entity()
@Index("USER_EMAIL_INDEX", { synchronize: false })
export class User {

    @PrimaryGeneratedColumn()
    id!: number

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
    passwordHash!: string

}