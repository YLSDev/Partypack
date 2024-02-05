import { Router } from "express";
import { existsSync, readFileSync } from "fs";
import { FULL_SERVER_ROOT } from "../Modules/Constants";
import { CreateBlurl } from "../Modules/BLURL";
import { Song } from "../Schemas/Song";
import { RequireAuthentication } from "../Modules/Middleware";
import { UserPermissions } from "../Schemas/User";

const App = Router();

App.get("/api/download/partypacker", (_, res) => res.redirect(`${FULL_SERVER_ROOT}/assets/Partypack-Launcher.zip`))

App.get("/song/download/:InternalID/:File",
RequireAuthentication(),
async (req, res) => {
    //const Song = AvailableFestivalSongs.find(x => x.UUID === req.params.SongUUID);
    const SongData = await Song.findOne({ where: { ID: req.params.InternalID }, relations: { Author: true } });
    if (!SongData)
        return res.status(404).send("Song not found.");
    
    if (SongData.IsDraft && (req.user!.PermissionLevel! < UserPermissions.VerifiedUser && SongData.Author.ID !== req.user!.ID))
        return res.status(403).send("You cannot use this track, because it's a draft.");

    const BaseURL = `${FULL_SERVER_ROOT}/song/download/${SongData.ID}/`;
    switch (req.params.File.toLowerCase()) {
        case "master.blurl":
        case "main.blurl":
            return res.set("content-type", "text/plain").send(
                CreateBlurl({
                    playlists: [
                        {
                            type: "main",
                            language: "en",
                            url: `${SongData.Directory}/Manifest.mpd`,
                            data: readFileSync(`${SongData.Directory}/Manifest.mpd`).toString().replaceAll("{BASEURL}", BaseURL)
                        }
                    ],
                    type: "vod",
                    audioonly: true
                })
            );

        case "manifest":
        case "manifest.mpd":
            return res.set("content-type", "application/dash+xml").send(Buffer.from(readFileSync(`${SongData.Directory}/Manifest.mpd`).toString().replaceAll("{BASEURL}", BaseURL)));
        
        case "cover":
        case "cover.png":
            return existsSync(`${SongData.Directory}/Cover.png`) ? res.set("content-type", "image/png").send(readFileSync(`${SongData.Directory}/Cover.png`)) : res.status(404).send("Cover not found.");

        // ! we are not risking a lawsuit
        //case "midi.dat": // dont forget to encrypt!
            //return existsSync(`${Song.Directory}/Data.mid`) ? res.set("content-type", "application/octet-stream").send(AesEncrypt(readFileSync(`${Song.Directory}/Data.mid`))) : res.sendStatus(404);

        // funny little tip: you dont actually need to encrypt midis LMFAO
        case "midi":
        case "midi.mid":
        case "midi.midi": // forget to encrypt!
            return existsSync(`${SongData.Directory}/Data.mid`) ? res.set("content-type", "application/octet-stream").send(readFileSync(`${SongData.Directory}/Data.mid`)) : res.status(404).send("Midi not found.");
    }
    
    if (!/^[\w\-.]+$/g.test(req.params.File))
        return res.status(400).send("File name failed validation.");

    if (!req.params.File.endsWith(".m4s") && !req.params.File.endsWith(".webm"))
        return res.status(403).send("Unsupported File Format.");

    if (!existsSync(`${SongData.Directory}/Chunks/${req.params.File}`))
        return res.status(404).send("Chunk not found.");

    res.set("content-type", "video/mp4")
    res.send(readFileSync(`${SongData.Directory}/Chunks/${req.params.File}`));
});

App.get("/:InternalID",
RequireAuthentication(),
async (req, res, next) => {
    const SongData = await Song.findOne({ where: { ID: req.params.InternalID }, relations: { Author: true } });
    if (!SongData)
        return next(); // trust me bro

    if (SongData.IsDraft && ((req.user ? req.user.PermissionLevel < UserPermissions.VerifiedUser : true) && SongData.Author.ID !== req.user!.ID))
        return res.status(403).send("You cannot use this track, because it's a draft.");

    const BaseURL = `${FULL_SERVER_ROOT}/song/download/${SongData.ID}/`;
    res.set("content-type", "application/json");
    res.json({
        playlist: Buffer.from(readFileSync(`${SongData.Directory}/Manifest.mpd`).toString().replaceAll("{BASEURL}", BaseURL)).toString("base64"),
        playlistType: "application/dash+xml",
        metadata: {
            assetId: "",
            baseUrls: [ BaseURL ],
            supportsCaching: true,
            ucp: "a",
            version: Math.floor(Date.now() / 1000)
        }
    });
});

export default {
    App
}
