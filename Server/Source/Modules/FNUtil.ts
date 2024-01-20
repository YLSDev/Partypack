import axios from "axios";
import { Err } from "./Logger";
import { red } from "colorette";
import { FULL_SERVER_ROOT } from "./Constants";
import { AvailableFestivalSongs } from "./FestivalUtil";

export let FullFortnitePages: object | null = null;
let LastContentDownloadDate: Date = new Date(0); // set it to 1970 as default cuz im not boutta check if its null

export async function GenerateFortnitePages(): Promise<{ Success: boolean, FNPages: { [key: string]: unknown } | null }> {
    const { status, data } = // check if 30 minutes have passed since last content update. if so, get a new copy of pages, if not, fuck off
        FullFortnitePages === null || Date.now() > LastContentDownloadDate.getTime() + 30 * 60 * 1000 ?
            await axios.get("https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game") :
            { status: 200, data: FullFortnitePages };

    FullFortnitePages = data;
    LastContentDownloadDate = new Date();

    if (status !== 200) {
        Err(`Failed to get Fortnite pages: ${red(status)}`);
        console.log(data);
        process.exit(-1); // very big fuck moment, we literally cannot run the server without fortnitepages
    }

    const AllSongs: { [key: string]: unknown } = {}; // too lazy to actually write a schema for this :D
    for (const Song of AvailableFestivalSongs) 
    {
        AllSongs[Song.UUID] = {
            _title: Song.UUID,
            _noIndex: false,
            _activeDate: "2023-01-01T01:00:00.000Z",
            _locale: "en-US",
            _templateName: "track",
            lastModified: new Date().toISOString(),
            track: {
                tt: Song.Name, // tt - Title,
                an: Song.Artist, // an - Artist Name
                mm: Song.MinorMajor, // mm - Minor, Major
                mk: Song.Key, // mk - Music Key
                ab: Song.Album, // ab - Album
                su: Song.UUID, // su - Song UUID
                ry: Song.Year, // ry - Release Year
                mt: Song.BeatsPerMinute, // mt - Music Timing (?)
                au: Song.Cover ?? `${FULL_SERVER_ROOT}/song/download/${Song.UUID}/cover.png`, // au - Album Cover
                gt: [ "Jam-LoopIsUnpitched-Beat" ], // gt - Gameplay Tags (but in a different format: Example.Gameplay.Tag -> Example-Gameplay-Tag)
                ti: `SparksSong:${Song.AssetID.toLowerCase()}`,
                mu: Song.Midi ?? `${FULL_SERVER_ROOT}/song/download/${Song.UUID}/midi.mid`, // mu - Song Midi (if ending with .mid, decrypted, if with .dat, encrypted)
                dn: Song.Length, // dn - Track Length (in seconds)
                ge: [ "Pop" ], // ge - Genres
                in: { // TODO: fuck with this to make difficulties :+1:
                    ba: 1,
                    pb: 2,
                    pd: 3,
                    pg: 4,
                    vl: 3,
                    ds: 2,
                    gr: 1,
                    _type: "SparkTrackIntensities"
                }, // in - Intensities (those white bars you see)
                sib: "Bass", // sib - Bass ID to use (only Bass possible)
                sid: "Drum", // sid - Drums ID to use (only Drum possible)
                sig: Song.GuitarType, // sig - Guitar ID to use (Keytar/Guitar)
                siv: "Vocals", // siv - Vocals ID to use (only Vocals possible)
                qi: JSON.stringify({ // qi - Query Information (frontend related display stuff and language vocals channel related stuff)
                    sid: Song.UUID, // sid - Song UUID
                    pid: Song.UUID, // pid - Playlist Asset ID
                    title: Song.UUID, // title - Song Name - same as _title
                    tracks: [
                        {
                            part: "ds", // Drum Set
                            channels: [ "FL", "FR" ],
                            vols: [ 4, 4 ]
                        },
                        {
                            part: "bs", // Bass Set (not bullshit)
                            channels: [ "FL", "FR" ],
                            vols: [ 4, 4 ]
                        },
                        {
                            part: "gs", // Guitar Set
                            channels: [ "FL", "FR" ],
                            vols: [ 4, 4 ]
                        },
                        {
                            part: "vs", // Vocal Set (not Visual Studio)
                            channels: [ "FL", "FR" ],
                            vols: [ 4, 4 ]
                        },
                        {
                            part: "fs", // Fart Set (jk i have no idea) (might be Flare Set??????????????)
                            channels: [ "FL", "FR" ],
                            vols: [ 4, 4 ]
                        }
                    ],
                    preview: {
                        starttime: Song.PreviewTime
                    }
                }),
                ld: Song.LipsyncData, // ld - Lipsync Data (it's literally a uasset)
                jc: Song.JoinCode, // jc - Join Code (UEFN empty island with nothing - possibly downloads assets)
                sn: Song.UUID, // sn - Song Name - same as _title
                _type: "SparkTrack"
            }
        };
    }

    return { Success: true, FNPages: AllSongs };
}