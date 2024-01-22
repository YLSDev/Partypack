import { Router } from "express";
import { ForcedCategory } from "../Schemas/ForcedCategory";
import { Song } from "../Schemas/Song";

const App = Router();

App.get("/", async (req, res) => {
    const ForcedCategories = await ForcedCategory.find({ where: { Activated: true } });
    const New = {
        ID: "new",
        Header: "Recently added",
        Songs: (await Song.find({ take: 10, order: { CreationDate: "DESC" } })).map(x => x.Package())
    }

    res.json([
        ...ForcedCategories,
        New
    ])
});

export default {
    App,
    DefaultAPI: "/api/discovery"
}