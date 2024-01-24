import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Song } from "./Song";
import { Rating } from "./Rating";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    ID: string;

    @Column({ type: "simple-json" })
    Library: { SongID: string, Overriding: string }[];

    @OneToMany(() => Rating, R => R.Author)
    Ratings: Rating[];

    @ManyToMany(() => Song, { eager: true })
    @JoinTable()
    BookmarkedSongs: Song[];
}