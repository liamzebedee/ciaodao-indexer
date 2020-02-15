import {Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn, ManyToMany} from "typeorm";
import {Space} from "./Space";
import { Message } from "./Message";
import { EthAddress } from './EthAddress';


@Entity()
export class User {
    // @PrimaryGeneratedColumn()
    // id: number;

    @PrimaryColumn()
    did: string;

    @OneToMany(type => Message, x => x.creator)
    messages: Message[];

    @ManyToMany(type => Space, x => x.members)
    joinedSpaces: Space[];

    @OneToMany(type => EthAddress, x => x.linkedTo)
    addresses: EthAddress[];
}
