import { Router } from "express";
import { CachedSongFortnitePages } from "../Modules/PagesUtil"; // make sure to import pagesutil after festivalutil :fire:
import { FullFortnitePages } from "../Modules/FNUtil";
import axios from "axios";
import { IS_DEBUG } from "../Modules/Constants";

const App = Router();

App.get("/content/api/pages/fortnite-game", (_, res) => res.json(FullFortnitePages))

App.get("/content/api/pages/fortnite-game/:Section", async (req, res) => {
    if (req.params.Section.toLowerCase() === "spark-tracks") // custom song injection
        return res.json(
            {
                _title: "spark-tracks",
                _noIndex: false,
                _activeDate: "1987-01-01T01:00:00.000Z", // was that the bite of '87
                lastModified: new Date().toISOString(),
                _locale: "en-US",
                _templateName: "blank",
                ...CachedSongFortnitePages,
                _suggestedPrefetch: []
            }
        );

    const CachedSection = Object.values(FullFortnitePages!).find(x => x._title === req.params.Section);
    if (!CachedSection)
        return res.status(404).json({ error: "funny section not found haha kill me" });

    const ContentFromServer = await axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/${CachedSection._title}`);
    if (ContentFromServer.status !== 200)
        return res.status(404).json({ error: IS_DEBUG ? ContentFromServer.data : "Fortnite server returned an error." });

    res.json(ContentFromServer.data);
})

export default {
    App
}