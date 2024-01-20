import { GenerateFortnitePages } from "../Modules/FNUtil";
import { Msg } from "../Modules/Logger";

export let CachedSongFortnitePages: { [key: string]: unknown } | null = null;

export async function CacheFortnitePages() {
    const Result = await GenerateFortnitePages();
    if (!Result.Success)
        return; // fuck we're fucked

    CachedSongFortnitePages = Result.FNPages;
    Msg("Successfully reloaded Fortnite pages!");
}