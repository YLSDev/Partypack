import { Button, Heading, Text } from "@primer/react";

export function Download() {
    return (
        <>
            <center>
                <Heading>You're one step away from experiencing peak Fortnite Festival</Heading>
                <Text>Click the button below to download <b>Partypacker</b> to launch into Fortnite with custom Partypack songs!</Text>
                <Button onClick={() => window.open((import.meta.env.VITE_SERVER_ROOT_URL ?? "http://localhost:6677/") + "api/download/partypacker")}>Download Partypacker</Button>
            </center>
        </>
    )
}