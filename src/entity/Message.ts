import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Space} from "./Space";
import {User} from "./User";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    time: number;

    @ManyToOne(type => Space, x => x.messages)
    space: Space;

    @ManyToOne(type => User, x => x.messages)
    creator: User
}
