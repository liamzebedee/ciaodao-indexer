import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { Message } from "./Message";
import { User } from './User';


@Entity()
export class Space {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    tokenAddress: string;

    @OneToMany(type => Message, x => x.space)
    messages: Message[];

    @ManyToMany(type => User, x => x.joinedSpaces)
    @JoinTable()
    members: User[];
}
