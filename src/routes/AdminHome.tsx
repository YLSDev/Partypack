import { Box, Text } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";
import { useEffect, useState } from "react";
import { VerifyAdminKey } from "../utils/AdminUtil";
import { useCookies } from "react-cookie";

export function AdminHome() {
    const [keyValid, setKeyValid] = useState(false);
    const [cookies] = useCookies();

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
                </PageHeader.Description>
            </PageHeader>
        </Box>
    )
}