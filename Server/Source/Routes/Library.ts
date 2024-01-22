import { Router } from "express";
import { RequireAuthentication } from "../Modules/Middleware";
import { Song } from "../Schemas/Song";
import { OriginalSparks } from "../Modules/FNUtil";

const App = Router();

App.get("/me", RequireAuthentication({ BookmarkedSongs: true }), (req, res) => {
    res.json({
        Bookmarks: req.user?.BookmarkedSongs.map(x => x.Package()),
        Library: req.user?.Library
    })
})

App.post("/me/activate", RequireAuthentication(), async (req, res) => {
    if (!req.body.SongID || !req.body.ToOverride)
        return res.status(400).json({ errorMessage: "You didn't provide a Song ID." });

    if (!/^sid_placeholder_(\d){1,3}$/gi.test(req.body.ToOverride))
        return res.status(400).json({ errorMessage: "Field \"ToOverride\" must match \"sid_placeholder_<number>\"" });

    if (req.user?.Library.findIndex(x => x.SongID.toLowerCase() === req.body.SongID.toLowerCase() || x.Overriding.toLowerCase() === req.body.ToOverride.toLowerCase()) !== -1)
        return res.status(400).json({ errorMessage: "This song is already activated." });

    if (!await Song.exists({ where: { ID: req.body.SongID } }))
        return res.status(404).json({ errorMessage: "Provided song doesn't exist." });

    req.user?.Library.push({ SongID: req.body.SongID.toLowerCase(), Overriding: req.body.ToOverride.toLowerCase() });
    req.user?.save();

    res.json(req.user?.Library);
})

App.post("/me/deactivate", RequireAuthentication(), async (req, res) => {
    if (!req.body.SongID)
        return res.status(400).json({ errorMessage: "You didn't provide a Song ID." });

    const idx = req.user!.Library.findIndex(x => x.SongID.toLowerCase() === req.body.SongID.toLowerCase());
    if (idx === -1)
        return res.status(400).json({ errorMessage: "This song is not activated." });

    req.user?.Library.splice(idx, 1);
    req.user?.save();

    res.json(req.user?.Library);
})

App.post("/me/bookmark", RequireAuthentication({ BookmarkedSongs: true }), async (req, res) => {
    if (!req.body.SongID)
        return res.status(400).json({ errorMessage: "You didn't provide a Song ID." });

    if (req.user?.BookmarkedSongs.findIndex(x => x.ID.toLowerCase() === req.body.SongID.toLowerCase()) !== -1)
        return res.status(400).json({ errorMessage: "This song is already bookmarked." });

    const SongData = await Song.findOne({ where: { ID: req.body.SongID } });
    if (!SongData)
        return res.status(404).json({ errorMessage: "Provided song doesn't exist." });

    req.user?.BookmarkedSongs.push(SongData);
    req.user?.save();

    res.json(req.user?.BookmarkedSongs.map(x => x.Package()));
})

App.post("/me/unbookmark", RequireAuthentication(), async (req, res) => {
    if (!req.body.SongID)
        return res.status(400).json({ errorMessage: "You didn't provide a Song ID." });

    const idx = req.user!.BookmarkedSongs.findIndex(x => x.ID.toLowerCase() === req.body.SongID.toLowerCase());
    if (idx === -1)
        return res.status(400).json({ errorMessage: "This song is not bookmarked." });

    req.user?.BookmarkedSongs.splice(idx, 1);
    req.user?.save();

    res.json(req.user?.BookmarkedSongs.map(x => x.Package()));
})

App.get("/song/data/:InternalID", async (req, res) => {
    const SongData = await Song.findOne({ where: { ID: req.params.InternalID } });
    if (!SongData)
        return res.status(404).json({ errorMessage: "Song not found." });

    res.json(SongData.Package());
})

App.get("/available", (__, res) => res.json(Object.values(OriginalSparks!).filter(x => !!x.track).map(x => { return { Name: x.track.tt, Template: x.track.ti.substring(11) }; }).sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1)))

export default {
    App,
    DefaultAPI: "/api/library"
}