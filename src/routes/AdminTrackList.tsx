import axios from "axios";
import { Box, Button, Heading } from "@primer/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Song } from "../components/Song";
import { useNavigate } from "react-router-dom";

export function AdminTrackList() {
    const [tracks, setTracks] = useState<unknown[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const Tracks = await axios.get("/api/admin/tracks");
            if (Tracks.status !== 200)
                return toast("Error while requesting tracks!");

            setTracks(Tracks.data);
        })();
    }, []);

    return (
        <>
            <Heading>All tracks (admin) <Button sx={{ marginBottom: 2 }} onClick={() => navigate("/admin/tracks/create")}>Create</Button></Heading>
            <Box className="songCategory">
                {
                    tracks.map(x => {
                        return <Song data={x}>
                            <Button sx={{ width: "100%", marginBottom: 1 }}>View Details</Button>
                            <Button sx={{ width: "100%" }} variant="danger">Disable</Button>
                        </Song>
                    })
                }
            </Box>
        </>
    )
}