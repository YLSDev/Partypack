import { existsSync, lstatSync, readFileSync, readdirSync } from "fs";
import { SongItemDefinition } from "./Classes";
import { CacheFortnitePages } from "./PagesUtil";
import { Debug, Err, Warn } from "./Logger";
import { magenta, yellow } from "colorette";
import watch from "node-watch";

export let AvailableFestivalSongs: SongItemDefinition[] = [];

export function LoadSongs() {
    AvailableFestivalSongs =
        readdirSync("../Saved/Songs")
            .filter(f => lstatSync(`../Saved/Songs/${f}`).isDirectory() && existsSync(`../Saved/Songs/${f}/Config.json`))
            .map(f => {
                let Config: SongItemDefinition;

                try { Config = JSON.parse(readFileSync(`../Saved/Songs/${f}/Config.json`).toString()); }
                catch { Err(`Config for song ${f} failed to parse. Please make sure it's valid!`); process.exit(-1); }

                // todo: validate if it has all the required properities
                Debug(`Added ${magenta(`${Config.Artist} - ${Config.Name} (${Config.UUID})`)} to the list of available Festival songs!`);

                return {
                    Directory: `../Saved/Songs/${f}`,
                    ...Config
                };
            });
}

watch("../Saved/Songs", { recursive: true }, (Event, Filename) => {
    Warn(`Detected ${yellow("saved songs")} changes in ${yellow(Filename)}. Reloading available songs!`);
    Debug(`${magenta(Event)} on ${magenta(Filename)}`);
    LoadSongs();
    CacheFortnitePages();
})