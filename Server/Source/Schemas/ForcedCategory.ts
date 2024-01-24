import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./Song";

@Entity()
export class ForcedCategory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column()
    Header: string;

    @Column()
    Activated: boolean;

    @Column()
    Priority: number;

    @ManyToMany(() => Song, { eager: true })
    @JoinTable()
    Songs: Song[];
}