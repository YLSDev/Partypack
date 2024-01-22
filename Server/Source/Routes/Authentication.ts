import axios from "axios";
import jwt from "jsonwebtoken";
import qs from "querystring";
import { Response, Router } from "express";
import { DASHBOARD_ROOT, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, FULL_SERVER_ROOT, JWT_KEY } from "../Modules/Constants";
import { User } from "../Schemas/User";

const App = Router();

// ? hacky, if you want, make it less hacky
async function QuickRevokeToken(res: Response, Token: string) {
    await axios.post("https://discord.com/api/oauth2/token/revoke", qs.stringify({ token: Token, token_type_hint: "access_token" }), { auth: { username: DISCORD_CLIENT_ID!, password: DISCORD_CLIENT_SECRET! } })
    return res;
}

App.get("/discord/url", (_ ,res) => res.send(`https://discord.com/api/oauth2/authorize?client_id=${qs.escape(DISCORD_CLIENT_ID!)}&response_type=code&redirect_uri=${qs.escape(`${FULL_SERVER_ROOT}/api/discord`)}&scope=identify`))

App.get("/discord", async (req, res) => {
    if (!req.query.code)
        return res.status(400).send("Please authorize with Discord first.");

    if (!/^(\w|\d)+$/gi.test(req.query.code as string))
        return res.status(400).send("Malformed code.");

    const Discord = await axios.post(`https://discord.com/api/oauth2/token`, qs.stringify({ grant_type: "authorization_code", code: req.query.code as string, redirect_uri: `${FULL_SERVER_ROOT}/api/discord` }), { auth: { username: DISCORD_CLIENT_ID!, password: DISCORD_CLIENT_SECRET! } });
    
    if (Discord.status !== 200)
        return res.status(500).send("Failed to request OAuth token from Discord's services.");

    if (!Discord.data.scope.includes("identify"))
        return (await QuickRevokeToken(res, Discord.data.access_token)).status(400).send("Missing identify scope. Please check if your OAuth link is correctly set up!");

    const UserData = await axios.get(`https://discord.com/api/users/@me`, { headers: { Authorization: `${Discord.data.token_type} ${Discord.data.access_token}` } });
    if (UserData.status !== 200)
        return (await QuickRevokeToken(res, Discord.data.access_token)).status(500).send("Failed to request user data from Discord's services.");

    await QuickRevokeToken(res, Discord.data.access_token);

    if (!await User.exists({ where: { ID: UserData.data.id } }))
        await User.create({
            ID: UserData.data.id,
            Library: []
        }).save();

    res
        .cookie("Token", jwt.sign({ ID: UserData.data.id }, JWT_KEY!, { algorithm: "HS256" }))
        .cookie("UserDetails", Buffer.from(JSON.stringify({ ID: UserData.data.id, Username: UserData.data.username, GlobalName: UserData.data.global_name, Avatar: `https://cdn.discordapp.com/avatars/${UserData.data.id}/${UserData.data.avatar}.webp` })).toString("base64"))
        .redirect(`${DASHBOARD_ROOT}/profile`);
})

export default {
    App,
    DefaultAPI: "/api"
}