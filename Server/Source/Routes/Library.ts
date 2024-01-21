import { Router } from "express";

const App = Router();

App.get("/song/data/:InternalID", (req, res) => {
    res.json({
        
    })
})

export default {
    App,
    DefaultAPI: "/api/library"
}