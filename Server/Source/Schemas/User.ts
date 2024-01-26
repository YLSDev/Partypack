import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Song } from "./Song";
import { Rating } from "./Rating";

export enum UserPermissions { // increments of 100 in case we want to add permissions inbetween without fucking up all instances
    User = 100,
    VerifiedUser = 200,
    Moderator = 300,
    Administrator = 400
}

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    ID: string;

    @Column({ type: "simple-json" })
    Library: { SongID: string, Overriding: string }[];

    @Column({ default: UserPermissions.User })
    PermissionLevel: UserPermissions;

    @OneToMany(() => Rating, R => R.Author)
    Ratings: Rating[];

    @ManyToMany(() => Song, { eager: true })
    @JoinTable()
    BookmarkedSongs: Song[];
}