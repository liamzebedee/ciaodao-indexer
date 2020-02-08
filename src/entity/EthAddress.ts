import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn} from "typeorm";
import {Space} from "./Space";
import { User } from './User';

@Entity()
export class EthAddress {
    @PrimaryColumn()
    address: string;

    @ManyToOne(type => User, x => x.addresses)
    linkedTo: User;
}
