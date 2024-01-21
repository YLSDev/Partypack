import { Box, Text } from "@primer/react";
import { Divider } from "@primer/react/lib-esm/ActionList/Divider";

export function Song({ children }: { children: JSX.Element[] }) {
    return (
        <Box sx={{ overflow: "hidden", minWidth: 50, maxWidth: 200, padding: 2, borderRadius: 10, border: "solid", borderColor: "border.default" }}>
            <img src="https://cdn2.unrealengine.com/d5yc9zpe97um68u6-512x512-a7f5fc0d3c2f.png" style={{ width: "100%", borderRadius: 10 }} />
            <center>
                <Text sx={{ fontSize: 1, display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>Someone</Text>
                <Text sx={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>Someone's Song Someone's Song</Text>
                <Divider />
            </center>
            {children}
        </Box>
    )
}