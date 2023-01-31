import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from "typeorm"
import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { User } from "./user";
import * as crypto from 'crypto';

@Entity()
@Index("SESSION_TOKEN_INDEX", { synchronize: false })
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
    expiredAt!: Date

    @Column({
        nullable: true
    })
    @IsDate()
    revokedAt!: Date

    constructor() {
        this.expiredAt = new Date(Date.now() + (60 * 60 * 24 * 5 * 1000));
        this.token = crypto.randomBytes(48).toString('base64');
    }

}