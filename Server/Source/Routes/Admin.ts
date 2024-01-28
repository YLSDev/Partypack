/* eslint-disable no-case-declarations */
import { FULL_SERVER_ROOT } from "../Modules/Constants";
import { Router } from "express";
import { UserPermissions } from "../Schemas/User";
import { Song } from "../Schemas/Song";
import { RequireAuthentication, ValidateBody } from "../Modules/Middleware";
import { writeFileSync } from "fs";
import { ForcedCategory } from "../Schemas/ForcedCategory";
import { fromBuffer } from "file-type";
import { Debug } from "../Modules/Logger";
import { magenta } from "colorette";
import ffmpeg from "fluent-ffmpeg";
import j from "joi";

const App = Router();

// ! ANY ENDPOINTS DEFINED IN THIS FILE WILL REQUIRE ADMIN AUTHORIZATION !
// ! ANY ENDPOINTS DEFINED IN THIS FILE WILL REQUIRE ADMIN AUTHORIZATION !
// ! ANY ENDPOINTS DEFINED IN THIS FILE WILL REQUIRE ADMIN AUTHORIZATION !

App.use(RequireAuthentication());

App.use((req, res, next) => {
    const IsAdmin = req.user!.PermissionLevel! >= UserPermissions.Administrator;
    if (req.path === "/key")
        return res.status(IsAdmin ? 200 : 403).send(IsAdmin ? "Login successful!" : "Key doesn't match. Try again.");

    if (!IsAdmin)
        return res.status(403).send("You don't have permission to access this endpoint.");

    next();
});

App.get("/tracks", async (_, res) => res.json((await Song.find()).map(x => x.Package())));

App.post("/create/song",
ValidateBody(j.object({
    ID: j.string().uuid(),
    Name: j.string().required().min(3).max(64),
    Year: j.number().required().min(1).max(2999),
    ArtistName: j.string().required().min(1).max(64),
    Length: j.number().required().min(1),
    Scale: j.string().valid("Minor", "Major").required(),
    Key: j.string().valid("A", "Ab", "B", "Bb", "C", "Cb", "D", "Db", "E", "Eb", "F", "Fb", "G", "Gb").required(),
    Album: j.string().required(),
    GuitarStarterType: j.string().valid("Keytar", "Guitar").required(),
    Tempo: j.number().min(20).max(1250).required(),
    Midi: j.string().uri(),
    Cover: j.string().uri(),
    Lipsync: j.string().uri(),
    BassDifficulty: j.number().required().min(0).max(7),
    GuitarDifficulty: j.number().required().min(0).max(7),
    DrumsDifficulty: j.number().required().min(0).max(7),
    VocalsDifficulty: j.number().required().min(0).max(7)
})),
async (req, res) => {
    res.json(await Song.create({ ...req.body, Draft: false, Author: req.user! }).save())
});

App.post("/upload/midi",
ValidateBody(j.object({
    Data: j.string().hex().required(),
    TargetSong: j.string().uuid().required()
})),
async (req, res) => {
    const Decoded = Buffer.from(req.body.Data, "hex");

    if ((await fromBuffer(Decoded))?.ext !== "mid")
        return res.status(400).send("Uploaded MIDI file is not a valid MIDI.");

    if (!await Song.exists({ where: { ID: req.body.TargetSong } }))
        return res.status(404).send("The song you're trying to upload a MIDI for does not exist.");

    writeFileSync(`./Saved/Songs/${req.body.TargetSong}/Data.mid`, Decoded);
    res.send(`${FULL_SERVER_ROOT}/song/download/${req.body.TargetSong}/midi.mid`);
});

App.post("/upload/audio",
    RequireAuthentication(),
    ValidateBody(j.object({
        Data: j.string().hex().required(),
        TargetSong: j.string().uuid().required()
    })),
    async (req, res) => {
        const Decoded = Buffer.from(req.body.Data, "hex");
        const ext = (await fromBuffer(Decoded))!.ext;

        if (!["mp3", "m4a", "ogg", "wav"].includes(ext))
            return res.status(404).send("Invalid audio file. (supported: mp3, m4a, ogg, wav)");

        if (!await Song.exists({ where: { ID: req.body.TargetSong } }))
            return res.status(404).send("The song you're trying to upload audio for does not exist.");

        await writeFileSync(`./Saved/Songs/${req.body.TargetSong}/Audio.${ext}`, Decoded);
        ffmpeg()
            .input(`./Saved/Songs/${req.body.TargetSong}/Audio.${ext}`)
            .outputOptions([
                "-map 0",
                "-use_timeline 1",
                "-f dash"
            ])
            .output(`./Saved/Songs/${req.body.TargetSong}/Chunks/Manifest.mpd`)
            .on("start", cl => Debug(`ffmpeg running with ${magenta(cl)}`))
            .on("end", () => Debug("Ffmpeg finished running"))
            .on("error", (e, stdout, stderr) => { console.error(e); console.log(stdout); console.error(stderr); })
            .run();

        res.send("ffmpeg now running on song.");
    });

App.post("/upload/cover",
ValidateBody(j.object({
    Data: j.string().hex().required(),
    TargetSong: j.string().uuid().required()
})),
async (req, res) => {
    const Decoded = Buffer.from(req.body.Data, "hex");
    const ext = (await fromBuffer(Decoded))!.ext;

    if (ext !== "png")
        return res.status(400).send("Invalid image file. (supported: png)");

    if (!await Song.exists({ where: { ID: req.body.TargetSong } }))
        return res.status(404).send("The song you're trying to upload a cover for does not exist.");

    try {
        /*const ImageMetadata = exif(Decoded);
        if (!ImageMetadata.Image?.ImageWidth || !ImageMetadata.Image?.ImageLength)
            throw new Error("Invalid image file.");

        if (ImageMetadata.Image.ImageWidth !== ImageMetadata.Image.ImageLength)
            return res.status(400).send("Image must have a 1:1 ratio.");

        if (ImageMetadata.Image.ImageWidth < 512 || ImageMetadata.Image.ImageWidth > 2048)
            return res.status(400).send("Image cannot be smaller than 512 pixels and larger than 2048 pixels.");*/
    } catch (err) {
        console.error(err)
        return res.status(400).send("Invalid image file.");
    }

    writeFileSync(`./Saved/Songs/${req.body.TargetSong}/Cover.png`, Decoded);
    res.send(`${FULL_SERVER_ROOT}/song/download/${req.body.TargetSong}/cover.png`);
});

App.post("/update/discovery",
ValidateBody(j.array().items(j.object({
    ID: j.string().uuid().required(),
    Songs: j.array().items(j.string().uuid()).unique().min(1).max(20).required(),
    Priority: j.number().min(-50000).max(50000).required(),
    Header: j.string().min(3).max(125).required(),
    ShouldDelete: j.boolean().required()
})).max(15)),
async (req, res) => {
    const b = req.body as { ID: string, Songs: string[], Priority: number, Header: string, ShouldDelete: boolean }[];
    const Failures: { Regarding: string, Message: string }[] = [];
    const Successes: { Regarding: string, Message: string }[] = [];

    for (const Entry of b) {
        let Category = await ForcedCategory.findOne({ where: { ID: Entry.ID } });
        if (Entry.ShouldDelete) { // DELETION
            if (!Category) {
                Failures.push({ Regarding: Entry.ID, Message: "Cannot delete non-existent category." });
                continue;
            }

            await Category.remove();
            Successes.push({ Regarding: Entry.ID, Message: "Successfully deleted category." });
            continue;
        }

        if (!Category) // CREATION
            Category = await ForcedCategory.create({
                Header: Entry.Header,
                Activated: true,
                Priority: Entry.Priority,
                Songs: []
            });

        // MODIFICATION
        const Songs = await Promise.all(Entry.Songs.map(x => Song.findOne({ where: { ID: x } })));
        if (Songs.includes(null)) {
            Failures.push({ Regarding: Entry.ID, Message: `Cannot modify "${Entry.ID}" songs as it includes a non-existent song` });
            continue;
        }

        Category.Header = Entry.Header;
        Category.Priority = Entry.Priority;
        Category.Songs = Songs as Song[];
        Category.save();

        Successes.push({ Regarding: Entry.ID, Message: `Successfully created/modified category "${Category.ID}".` });
    }

    res.status(Failures.length > Successes.length ? 400 : 200).json({
        Failures,
        Successes
    })
});

export default {
    App,
    DefaultAPI: "/api/admin"
}