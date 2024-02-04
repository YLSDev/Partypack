import { DataSource } from "typeorm";
import { ENVIRONMENT, SAVED_DATA_PATH } from "../Modules/Constants";
import { Song } from "../Schemas/Song";
import { ForcedCategory } from "../Schemas/ForcedCategory";
import { User } from "../Schemas/User";
import { Rating } from "../Schemas/Rating";
import { DiscordRole } from "../Schemas/DiscordRole";

export const DBSource = new DataSource({
    type: "better-sqlite3",
    database: `${SAVED_DATA_PATH}/Partypack${ENVIRONMENT !== "prod" ? `-${ENVIRONMENT}` : ""}.db`,
    synchronize: true,
    logging: false,
    entities: [
        Song,
        ForcedCategory,
        User,
        Rating,
        DiscordRole
        /*join(__dirname, "..", "Schemas") + "\\*{.js,.ts}"*/ // does not work in prod
    ],
    subscribers: [],
    migrations: [],
    enableWAL: true
});

(async () => {
    await DBSource.initialize();
})();

/*
User
- discord id (primary)
- list of all songs in user's library
- list of all songs in user's published

Song
- length
- bpm
- key
- scale
- keytar/guitar
- icon url
- name
- artist
- release year
*/