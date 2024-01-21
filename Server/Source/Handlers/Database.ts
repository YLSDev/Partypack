import { DataSource } from "typeorm";
import { ENVIRONMENT } from "../Modules/Constants";
import { join } from "path";

export const DBSource = new DataSource({
    type: "better-sqlite3",
    database: `Partypack${ENVIRONMENT !== "prod" ? `-${ENVIRONMENT}` : ""}.db`,
    synchronize: true,
    logging: false,
    entities: [join(__dirname, "..", "Schemas") + "\\*{.js,.ts}"],
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