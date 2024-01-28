import { BaseEntity, BeforeInsert, BeforeRemove, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FULL_SERVER_ROOT } from "../Modules/Constants";
import { Rating } from "./Rating";
import { existsSync, mkdirSync, rmSync } from "fs";
import { v4 } from "uuid";
import { User } from "./User";
import { join } from "path";

@Entity()
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @ManyToOne(() => User, U => U.CreatedTracks)
    Author: User;

    @Column()
    Name: string;

    @Column()
    Year: number;

    @Column()
    ArtistName: string;

    @Column()
    Length: number;

    @Column()
    Scale: "Minor" | "Major";

    @Column()
    Key: string;

    @Column()
    Album: string;

    @Column({ default: "Guitar" })
    GuitarStarterType: "Keytar" | "Guitar";

    @Column()
    Tempo: number;

    @Column()
    Directory: string;

    @Column({ nullable: true })
    Midi?: string;

    @Column({ nullable: true })
    Cover?: string;

    @Column()
    BassDifficulty: number;

    @Column()
    GuitarDifficulty: number;

    @Column()
    DrumsDifficulty: number;

    @Column()
    VocalsDifficulty: number;

    @Column()
    IsDraft: boolean;

    @Column()
    CreationDate: Date;

    @Column({ nullable: true })
    Lipsync?: string;

    @OneToMany(() => Rating, R => R.Rated)
    Ratings: Rating[];

    @BeforeInsert()
    Setup() {
        this.ID = v4();
        this.Directory = `./Saved/Songs/${this.ID}`;
        if (!existsSync(join(this.Directory, "Chunks")))
            mkdirSync(join(this.Directory, "Chunks"), { recursive: true });

        this.CreationDate = new Date();
    }

    @BeforeRemove()
    Delete() {
        if (existsSync(this.Directory) && this.Directory.endsWith(this.ID))
            rmSync(this.Directory, { recursive: true, force: true }); // lets hope this does not cause steam launcher for linux 2.0
    }

    public Package() {
        return {
            ...this,
            Directory: undefined, // we should NOT reveal that
            Midi: this.Midi ?? `${FULL_SERVER_ROOT}/song/download/${this.ID}/midi.mid`,
            Cover: this.Cover ?? `${FULL_SERVER_ROOT}/song/download/${this.ID}/cover.png`
        }
    }
}