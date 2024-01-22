import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Song } from "./Song";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    ID: string;

    @Column({ type: "simple-json" })
    Library: { SongID: string, Overriding: string }[];

    @ManyToMany(() => Song, { eager: true })
    @JoinTable()
    BookmarkedSongs: Song[];
}