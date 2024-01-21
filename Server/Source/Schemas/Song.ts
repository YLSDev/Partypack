import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    Cover: string;

    @Column({ nullable: true })
    Lipsync?: string;
}