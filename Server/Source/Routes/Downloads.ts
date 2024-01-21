import { Router } from "express";
import { existsSync, readFileSync } from "fs";
import { AvailableFestivalSongs } from "../Modules/FestivalUtil";
import { FULL_SERVER_ROOT } from "../Modules/Constants";
import { CreateBlurl } from "../Modules/BLURL";

const App = Router();

App.get("/song/download/:SongUUID/:File", (req, res) => {
    const Song = AvailableFestivalSongs.find(x => x.UUID === req.params.SongUUID);
    if (!Song)
        return res.sendStatus(404);

    const BaseURL = `${FULL_SERVER_ROOT}/song/download/${Song.UUID}/`;
    switch (req.params.File.toLowerCase()) {
        case "master.blurl":
        case "main.blurl":
            return res.set("content-type", "text/plain").send(
                CreateBlurl({
                    playlists: [
                        {
                            type: "main",
                            language: "en",
                            url: `${BaseURL}master.blurl`,
                            data: readFileSync(`${Song.Directory}/Manifest.mpd`).toString().replaceAll("{BASEURL}", BaseURL)
                        }
                    ],
                    type: "vod",
                    audioonly: true
                })
            );

        case "manifest":
        case "manifest.mpd":
            return res.set("content-type", "application/dash+xml").send(Buffer.from(readFileSync(`${Song.Directory}/Manifest.mpd`).toString().replaceAll("{BASEURL}", BaseURL)));
        
        case "cover":
        case "cover.png":
            return existsSync(`${Song.Directory}/Cover.png`) ? res.set("content-type", "image/png").send(readFileSync(`${Song.Directory}/Cover.png`)) : res.sendStatus(404);

        // ! we are not risking a lawsuit
        //case "midi.dat": // dont forget to encrypt!
            //return existsSync(`${Song.Directory}/Data.mid`) ? res.set("content-type", "application/octet-stream").send(AesEncrypt(readFileSync(`${Song.Directory}/Data.mid`))) : res.sendStatus(404);

        // funny little tip: you dont actually need to encrypt midis LMFAO
        case "midi":
        case "midi.mid":
        case "midi.midi": // forget to encrypt!
            return existsSync(`${Song.Directory}/Data.mid`) ? res.set("content-type", "application/octet-stream").send(readFileSync(`${Song.Directory}/Data.mid`)) : res.sendStatus(404);
    }
    
    if (!/^[\w\-.]+$/g.test(req.params.File))
        return res.status(400).send("File name failed validation.");

    if (!req.params.File.endsWith(".m4s"))
        return res.sendStatus(403);

    if (!existsSync(`${Song.Directory}/Chunks/${req.params.File}`))
        return res.sendStatus(404);

    res.set("content-type", "video/mp4")
    res.send(readFileSync(`${Song.Directory}/Chunks/${req.params.File}`));
})

export default {
    App
}