import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { User } from "./user";
import * as crypto from 'crypto';

@Entity()
export class Session {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({
        length: 64
    })
    @IsNotEmpty()
    @IsString()
    token!: string

    @IsNotEmpty()
    @ManyToOne(() => User, (user) => user.id)
    user!: User

    @CreateDateColumn()
    createdAt!: Date

    @Column({
        nullable: true
    })
    @IsDate()
    updatedAt!: Date

    @Column()
    @IsDate()
    revokedAt!: Date

    constructor() {
        this.revokedAt = new Date(Date.now() + (60 * 60 * 24 * 5 * 1000));
        this.token = crypto.randomBytes(48).toString('base64');
    }

}