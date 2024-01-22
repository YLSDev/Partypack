import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FULL_SERVER_ROOT } from "../Modules/Constants";

@Entity()
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    ID: string;

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
    CreationDate: Date;

    @Column({ nullable: true })
    Lipsync?: string;

    @BeforeInsert()
    Setup() {
        this.CreationDate = new Date();
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