import j from "joi";
import exif from "exif-reader";
import ffmpeg from "fluent-ffmpeg";
import { Router } from "express";
import { RequireAuthentication, ValidateBody } from "../Modules/Middleware";
import { Song } from "../Schemas/Song";
import { Debug } from "../Modules/Logger";
import { magenta } from "colorette";
import { fromBuffer } from "file-type";
import { rmSync, writeFileSync } from "fs";
import { FULL_SERVER_ROOT } from "../Modules/Constants";
import { UserPermissions } from "../Schemas/User";

const App = Router();

App.post("/create",
    RequireAuthentication(),
    ValidateBody(j.object({
        Name: j.string().required().min(3).max(64),
        Year: j.number().required().min(1).max(2999),
        ArtistName: j.string().required().min(1).max(64),
        Length: j.number().required().min(1).max(10000),
        Scale: j.string().valid("Minor", "Major").required(),
        Key: j.string().valid("A", "Ab", "B", "Bb", "C", "Cb", "D", "Db", "E", "Eb", "F", "Fb", "G", "Gb").required(),
        Album: j.string().required(),
        GuitarStarterType: j.string().valid("Keytar", "Guitar").required(),
        Tempo: j.number().min(20).max(1250).required(),
        BassDifficulty: j.number().required().min(0).max(7),
        GuitarDifficulty: j.number().required().min(0).max(7),
        DrumsDifficulty: j.number().required().min(0).max(7),
        VocalsDifficulty: j.number().required().min(0).max(7)
    })),
    async (req, res) => {
        const SongData = await Song.create({
            ...req.body,
            IsDraft: true,
            Author: req.user!
        }).save();

        Debug(`New draft created by ${magenta(req.user!.ID!)} as ${magenta(`${SongData.ArtistName} - ${SongData.Name}`)}`)
        res.json(SongData.Package());
    });

App.post("/upload/midi",
    RequireAuthentication(),
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

App.post("/upload/cover",
    RequireAuthentication(),
    ValidateBody(j.object({
        Data: j.string().hex().required(),
        TargetSong: j.string().uuid().required()
    })),
    async (req, res) => {
        const Decoded = Buffer.from(req.body.Data, "hex");
        const ext = (await fromBuffer(Decoded))!.ext;

        if (ext !== "png")
            return res.status(404).send("Invalid image file. (supported: png)");

        const SongData = await Song.findOne({ where: { ID: req.body.TargetSong }, relations: { Author: true } })
        if (!SongData)
            return res.status(404).send("The song you're trying to upload a cover for does not exist.");

        if (req.user!.PermissionLevel! < UserPermissions.Administrator && SongData.Author.ID !== req.user!.ID)
            return res.status(403).send("You don't have permission to upload to this song.");

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
            .on("end", () => {
                Debug("Ffmpeg finished running");
                rmSync(`./Saved/Songs/${req.body.TargetSong}/Audio.${ext}`);
            })
            .on("error", (e, stdout, stderr) => {
                console.error(e);
                console.log(stdout);
                console.error(stderr);
                rmSync(`./Saved/Songs/${req.body.TargetSong}/Audio.${ext}`);
            })
            .run();

        res.send("ffmpeg now running on song.");
    });

App.post("/submit",
    RequireAuthentication(),
    ValidateBody(j.object({})),
    async (req, res) => {

    });

export default {
    App,
    DefaultAPI: "/api/drafts"
}