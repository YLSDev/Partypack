import { RequireAuthentication, ValidateBody } from "../Modules/Middleware";
import { Router } from "express";
import { Song } from "../Schemas/Song";
import { Rating } from "../Schemas/Rating";
import j from "joi";

const App = Router();

App.get("/:InternalID", async (req, res) => {
    const SongData = await Song.findOne({ where: { ID: req.params.InternalID }, relations: { Ratings: true } });
    if (!SongData)
        return res.status(404).send("The song you're trying to get the rating for has not been found.");

    let Average = 0;
    if (SongData.Ratings.length > 0) {
        SongData.Ratings.map(x => Average += x.Stars);
        Average = Average / SongData.Ratings.length;
    }

    res.json({
        Average,
        Amount: SongData.Ratings.length
    });
})

App.post("/:InternalID",
RequireAuthentication({ Ratings: { Rated: true } }),
ValidateBody(j.object({
    Rating: j.number().integer().min(1).max(5).required()
})),
async (req, res) => {
    const SongData = await Song.findOne({ where: { ID: req.params.InternalID } });
    if (!SongData)
        return res.status(404).send("The song you're trying to get the rating for has not been found.");

    const Existing = req.user?.Ratings.find(x => SongData.ID === x.Rated.ID)
    if (Existing)
    {
        Existing.Stars = req.body.Rating as number;
        await Existing.save();
        return res.json({
            ...Existing,
            Author: undefined,
            Rated: SongData.ID
        });
    }

    const CreatedRating = await Rating.create({
        Author: req.user,
        Rated: SongData,
        Stars: req.body.Rating as number
    }).save();

    res.json({
        ...CreatedRating,
        Author: undefined,
        Rated: SongData.ID
    });
})

export default {
    App,
    DefaultAPI: "/api/ratings"
}