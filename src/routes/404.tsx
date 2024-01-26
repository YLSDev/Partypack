import { Box, Heading, Link, Text } from "@primer/react";

export function NotFound() {
    return (
        <Box>
            <center>
                <Heading>404</Heading>
                <Text>We're sorry, but this page does not exist.</Text><br />
                <Link href="/">Go back to the Home Page</Link>
            </center>
        </Box>
    )
}