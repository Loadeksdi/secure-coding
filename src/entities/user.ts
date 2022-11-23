import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import { ValidationError } from "../errors/validation"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstname!: string

    @Column()
    lastname!: string

    @Column()
    email!: string

    @Column()
    passwordHash!: string

    @BeforeInsert()
    @BeforeUpdate()
    checkObjectIntegrity() {
        for (const property in this){
            if (this[property] === undefined && property !== 'id'){
                throw new ValidationError(this, property);
            }
        }
    }

}