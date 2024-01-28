import axios from "axios";
import jwt from "jsonwebtoken";
import qs from "querystring";
import j from "joi";
import { Response, Router } from "express";
import { BOT_TOKEN, DASHBOARD_ROOT, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_SERVER_ID, FULL_SERVER_ROOT, JWT_KEY } from "../Modules/Constants";
import { User, UserPermissions } from "../Schemas/User";
import { ValidateQuery } from "../Modules/Middleware";
import { Err } from "../Modules/Logger";

const App = Router();
//let DiscordServerRoleMetadata;

// ? hacky, if you want, make it less hacky
async function QuickRevokeToken(res: Response, Token: string) {
    await axios.post("https://discord.com/api/oauth2/token/revoke", qs.stringify({ token: Token, token_type_hint: "access_token" }), { auth: { username: DISCORD_CLIENT_ID!, password: DISCORD_CLIENT_SECRET! } })
    return res;
}

async function ReloadRoleData() {
    const DRMt = await axios.get(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/roles`, { headers: { Authorization: `Bot ${BOT_TOKEN}` } });

    Err(`Discord roles request failed to execute. Did you set up the .env correctly?`)
    if (DRMt.status !== 200)
        process.exit(-1);

    //DiscordServerRoleMetadata = DRMt.data as { id: string, name: string, permissions: number }[];
}

//ReloadRoleData();

App.get("/discord/url", (_ ,res) => res.send(`https://discord.com/api/oauth2/authorize?client_id=${qs.escape(DISCORD_CLIENT_ID!)}&response_type=code&redirect_uri=${qs.escape(`${FULL_SERVER_ROOT}/api/discord`)}&scope=identify`))

App.get("/discord",
ValidateQuery(j.object({
    code: j.string().pattern(/^(\w|\d)+$/i).required()
})),
async (req, res) => {
    const Discord = await axios.post(`https://discord.com/api/oauth2/token`, qs.stringify({ grant_type: "authorization_code", code: req.query.code as string, redirect_uri: `${FULL_SERVER_ROOT}/api/discord` }), { auth: { username: DISCORD_CLIENT_ID!, password: DISCORD_CLIENT_SECRET! } });
    
    if (Discord.status !== 200)
        return res.status(500).send("Failed to request OAuth token from Discord's services.");

    if (!Discord.data.scope.includes("identify"))
        return (await QuickRevokeToken(res, Discord.data.access_token)).status(400).send("Missing identify scope. Please check if your OAuth link is correctly set up!");

    const UserData = await axios.get(`https://discord.com/api/users/@me`, { headers: { Authorization: `${Discord.data.token_type} ${Discord.data.access_token}` } });
    if (UserData.status !== 200)
        return (await QuickRevokeToken(res, Discord.data.access_token)).status(500).send("Failed to request user data from Discord's services.");

    await QuickRevokeToken(res, Discord.data.access_token);

    // TODO: add discord role thingy
    let UserPermissionLevel = UserPermissions.User;

    let DBUser = await User.findOne({ where: { ID: UserData.data.id } });
    if (!DBUser)
        DBUser = await User.create({
            ID: UserData.data.id,
            Library: [],
            PermissionLevel: UserPermissionLevel
        }).save();

    const JWT = jwt.sign({ ID: UserData.data.id }, JWT_KEY!, { algorithm: "HS256" });
    const UserDetails = Buffer.from(JSON.stringify({ ID: UserData.data.id, Username: UserData.data.username, GlobalName: UserData.data.global_name, Avatar: `https://cdn.discordapp.com/avatars/${UserData.data.id}/${UserData.data.avatar}.webp`, IsAdmin: DBUser.PermissionLevel >= UserPermissions.Administrator })).toString("hex")
    if (req.query.state) {
        try {
            const Decoded = JSON.parse(Buffer.from(decodeURI(req.query.state as string), "base64").toString("utf-8"));
            if (Decoded.Client === "PartypackerDesktop")
                return res.redirect(`http://localhost:14968/?token=${encodeURI(JWT)}&user=${encodeURI(UserDetails)}`)
            else
                return res.status(400).send("Unsupported API client."); // idk maybe in the future we will maek more clients
        } catch {
            return res.status(400).send("Invalid state.");
        }
    }

    res
        .cookie("Token", JWT)
        .cookie("UserDetails", UserDetails)
        .redirect(`${DASHBOARD_ROOT}/profile`);
})

export default {
    App,
    DefaultAPI: "/api"
}