import { Box, Label, Text } from "@primer/react";
import { Divider } from "@primer/react/lib-esm/ActionList/Divider";

export function Song({ data, children }: { data: any, children?: JSX.Element[] | JSX.Element | string }) {
    return (
        <Box sx={{ overflow: "hidden", minWidth: 50, maxWidth: 200, padding: 2, borderRadius: 10, border: "solid", borderColor: "border.default" }}>
            <img src={data.Cover} style={{ width: "100%", borderRadius: 10 }} />
            <center>
                <Text sx={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{data.ArtistName}</Text>
                <Text sx={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}><b>{data.Name}</b></Text>
                {
                    data.IsDraft ? <Label variant="danger">Draft - not published</Label> : <></>
                }
                {
                    children ? <Divider /> : <></>
                }
            </center>
            {children ?? <></>}
        </Box>
    )
}