import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Message } from "./Message";


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

    // members
    // count distinct member in messages
}
