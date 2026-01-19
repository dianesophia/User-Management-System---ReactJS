import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Role } from './enums/role.enum';
import { Exclude } from 'class-transformer';
import { Gender } from "./enums/gender.enum";


@Entity('users')
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Exclude()
    @Column()
    password: string;

    @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
    })
    role: Role;

    @Column({
      type: 'enum',
      enum: Gender,
    })
    gender: Gender;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column()
    address: string;

    // Soft delete - tracks deletion timestamp instead of hard delete
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}