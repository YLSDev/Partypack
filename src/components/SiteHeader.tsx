import { Header } from "@primer/react";
import { useCookies } from "react-cookie";
import Favicon from "../assets/favicon.webp";
import { useNavigate } from "react-router-dom";

export function SiteHeader() {
    const [cookies] = useCookies();
    const navigate = useNavigate();

    return (
        <Header>
            <Header.Item sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <img src={Favicon} style={{ width: 32, height: "auto", paddingRight: 5 }} />
                <b>Partypack</b>
            </Header.Item>
            <Header.Item sx={{ cursor: "pointer" }}>Daily Rotation</Header.Item>
            <Header.Item sx={{ cursor: "pointer" }}>Leaderboards</Header.Item>
            <Header.Item sx={{ cursor: "pointer" }}>Tracks</Header.Item>
            <Header.Item sx={{ cursor: "pointer" }}>Tutorials</Header.Item>
            <Header.Item sx={{ cursor: "pointer" }}>FAQ</Header.Item>
            <Header.Item sx={{ cursor: "pointer" }} onClick={() => window.open("https://discord.gg/KaxknAbqDS")}>Discord</Header.Item>
            <Header.Item sx={{ cursor: "pointer", color: "accent.emphasis" }}>Download</Header.Item>
            { cookies["AdminKey"] ? <Header.Item onClick={() => navigate("/admin")} sx={{ cursor: "pointer", color: "danger.emphasis" }}>Admin</Header.Item> : <></> }
        </Header>
    );
}