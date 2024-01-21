import { Avatar, Box, Header } from "@primer/react";
import { SignInIcon } from "@primer/octicons-react"
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SiteContext, UserDetailInterface } from "../utils/State";
import { Buffer } from "buffer/";
import Favicon from "../assets/favicon.webp";
import axios from "axios";

export function SiteHeader() {
    const [discordUrl, setDiscordUrl] = useState("");
    const {state, setState} = useContext(SiteContext);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const Data = await axios.get("/api/discord/url");
            if (Data.status === 200)
                setDiscordUrl(Data.data);
        })();
    }, []);

    useEffect(() => {
        if (!cookies["UserDetails"])
            return;

        const Details: UserDetailInterface = JSON.parse(decodeURI(Buffer.from(cookies["UserDetails"], "base64").toString()));
        setState({
            ...state,
            UserDetails: Details
        });

        console.log(Details);
    }, [cookies["UserDetails"]])

    return (
        <Header>
            <Header.Item sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <img src={Favicon} style={{ width: 32, height: "auto", paddingRight: 5 }} />
                <b>Partypack</b>
            </Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }}>Daily Rotation</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }}>Leaderboards</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }}>Tracks</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }}>Tutorials</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }}>FAQ</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }} onClick={() => window.open("https://discord.gg/KaxknAbqDS")}>Discord</Header.Item>
            <Header.Item full sx={{ cursor: "pointer", color: "accent.emphasis" }}>Download</Header.Item>
            { cookies["AdminKey"] ? <Header.Item full onClick={() => navigate("/admin")} sx={{ cursor: "pointer", color: "danger.emphasis" }}>Admin</Header.Item> : <></> }
            {
                cookies["Token"] && state.UserDetails ?
                    <Header.Item sx={{ mr: 0, cursor: "pointer" }} onClick={() => navigate("/profile")}><Avatar src={state.UserDetails.Avatar} size={25} alt={`${state.UserDetails.GlobalName} (@${state.UserDetails.Username})`}/></Header.Item> :
                    <Box sx={{ cursor: "pointer" }} onClick={() => discordUrl ? window.location.assign(discordUrl) : console.log("no discord url :(")}><SignInIcon size={16} /></Box>
            }
        </Header>
    );
}