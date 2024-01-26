import { Box, Button, Text } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";
import { useNavigate } from "react-router-dom";

export function AdminHome() {
    const navigate = useNavigate();

    return (
        <Box>
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.Title>Partypack Admin Management Panel</PageHeader.Title>
                </PageHeader.TitleArea>
                <PageHeader.Description>
                    TEMP
                    <Button onClick={() => navigate("/admin/tracks")}>Tracks</Button>
                    <Button onClick={() => navigate("/admin/featured")}>Featured Tab Management</Button>
                </PageHeader.Description>
            </PageHeader>
        </Box>
    )
}