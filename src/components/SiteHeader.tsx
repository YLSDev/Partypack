import { Avatar, Box, Header } from "@primer/react";
import { SignInIcon } from "@primer/octicons-react"
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { SiteContext, UserDetailInterface } from "../utils/State";
import { toast } from "react-toastify";
import { Buffer } from "buffer/";
import Favicon from "../assets/favicon.webp";
import axios from "axios";

export function SiteHeader() {
    const {state, setState} = useContext(SiteContext);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const Data = await axios.get("/api/discord/url");
            const Details: UserDetailInterface = cookies["UserDetails"] ? JSON.parse(decodeURI(Buffer.from(cookies["UserDetails"], "hex").toString())) : null;
        
            setState({
                ...state,
                UserDetails: Details,
                DiscordOauthURL: Data.data
            });
        })();
    }, [cookies["UserDetails"]])

    return (
        <Header>
            <Header.Item sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <img src={Favicon} style={{ width: 32, height: "auto", paddingRight: 5 }} />
                <b>Partypack</b>
            </Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }} onClick={() => navigate("/tracks")}>Tracks</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }} onClick={() => navigate("/submissions")}>Submissions</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }} onClick={() => navigate("/tutorials")}>Tutorials</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }} onClick={() => navigate("/faq")}>FAQ</Header.Item>
            <Header.Item full sx={{ cursor: "pointer" }} onClick={() => window.open("https://discord.gg/KaxknAbqDS")}>Discord</Header.Item>
            <Header.Item full sx={{ cursor: "pointer", color: "accent.emphasis" }} onClick={() => navigate("/download")}>Download</Header.Item>
            { state.UserDetails?.IsAdmin ? <Header.Item onClick={() => navigate("/admin")} sx={{ cursor: "pointer", color: "danger.emphasis" }}>Admin</Header.Item> : <></> }
            {
                cookies["Token"] && state.UserDetails ?
                    <Header.Item sx={{ mr: 0, cursor: "pointer" }} onClick={() => navigate("/profile")}><Avatar src={state.UserDetails.Avatar} size={25} alt={`${state.UserDetails.GlobalName} (@${state.UserDetails.Username})`}/></Header.Item> :
                    <Box sx={{ cursor: "pointer" }} onClick={() => state.DiscordOauthURL ? window.location.assign(state.DiscordOauthURL) : toast("Cannot redirect to login. No Discord OAuth URL has been received from the backend.", { type: "error" })}><SignInIcon size={16} /></Box>
            }
        </Header>
    );
}