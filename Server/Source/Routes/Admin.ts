/* eslint-disable no-case-declarations */
import { FULL_SERVER_ROOT } from "../Modules/Constants";
import { Router } from "express";
import { UserPermissions } from "../Schemas/User";
import { Song, SongStatus } from "../Schemas/Song";
import { RequireAuthentication, ValidateBody } from "../Modules/Middleware";
import { writeFileSync } from "fs";
import { ForcedCategory } from "../Schemas/ForcedCategory";
import { fromBuffer } from "file-type";
import { Debug } from "../Modules/Logger";
import { magenta } from "colorette";
import ffmpeg from "fluent-ffmpeg";
import j from "joi";
import sizeOf from "image-size";

const App = Router();

// ! ANY ENDPOINTS DEFINED IN THIS FILE WILL REQUIRE ADMIN AUTHORIZATION !
// ! ANY ENDPOINTS DEFINED IN THIS FILE WILL REQUIRE ADMIN AUTHORIZATION !
// ! ANY ENDPOINTS DEFINED IN THIS FILE WILL REQUIRE ADMIN AUTHORIZATION !

App.use(RequireAuthentication());

App.use((req, res, next) => {
    if (req.user!.PermissionLevel! < UserPermissions.Administrator)
        return res.status(403).send("You don't have permission to access this endpoint.");

    next();
});

App.get("/tracks", async (_, res) => res.json((await Song.find()).map(x => x.Package(true))));

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