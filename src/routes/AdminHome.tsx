import { Box, Button, Text } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";
import { useEffect, useState } from "react";
import { VerifyAdminKey } from "../utils/AdminUtil";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function AdminHome() {
    const [keyValid, setKeyValid] = useState(false);
    const [cookies, , removeCookie] = useCookies(); // how in the fuck is this valid ts syntax???????????
    const navigate = useNavigate();

    useEffect(() => {
        (async() => setKeyValid((await VerifyAdminKey(cookies["AdminKey"])).Success))();
    }, [cookies]);

    return (
        <Box>
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.Title>Partypack Admin Management Panel</PageHeader.Title>
                </PageHeader.TitleArea>
                <PageHeader.Description>
                    Your admin key is { keyValid ? <Text sx={{ color: "accent.emphasis" }}>VALID</Text> : <Text sx={{ color: "danger.emphasis" }}>INVALID</Text> }
                    <Button variant="danger" size="small" onClick={() => {removeCookie("AdminKey"); navigate("/admin/login")}}>Log out</Button>
                </PageHeader.Description>
            </PageHeader>
        </Box>
    )
}