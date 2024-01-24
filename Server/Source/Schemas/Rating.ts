import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Song } from "./Song";

@Entity()
export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @ManyToOne(() => User, U => U.Ratings)
    Author: User;

    @ManyToOne(() => Song, S => S.Ratings)
    Rated: Song;

    @Column()
    Stars: number;
}