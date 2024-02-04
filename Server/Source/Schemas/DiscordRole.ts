import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { UserPermissions } from "./User";

@Entity()
export class DiscordRole extends BaseEntity {
    @PrimaryColumn()
    ID: string;

    @Column()
    GrantedPermissions: UserPermissions;

    @Column({ default: "No comment" })
    Comment: string;

    public Package(IncludeComment: boolean) {
        return {
            ...this,
            Comment: IncludeComment ? this.Comment : undefined
        }
    }
}