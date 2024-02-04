import { ActivityType, Client, IntentsBitField } from "discord.js";
import { Msg } from "../Modules/Logger";
import { green } from "colorette";
import { BOT_TOKEN } from "../Modules/Constants";

export const Bot: Client<true> = new Client({
    intents: IntentsBitField.Flags.Guilds,
    presence: {
        status: "online",
        activities: [
            {
                name: "over Partypack",
                type: ActivityType.Watching
            }
        ]
    }
});

Bot.on("ready", () => Msg(`Discord bot now ready as ${green(Bot.user.username)}${green("#")}${green(Bot.user.discriminator)}`));
Bot.login(BOT_TOKEN);