import { Avatar, Box, Button, Heading, Text } from "@primer/react"
import { Divider } from "@primer/react/lib-esm/ActionList/Divider";
import { PageHeader } from "@primer/react/drafts";
import { useContext } from "react";
import { SiteContext } from "../utils/State";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Song } from "../components/Song";

export function Profile() {
    const { state, setState } = useContext(SiteContext);
    const [, , removeCookie] = useCookies();
    const navigate = useNavigate();

    return (
        <>
            {
                state.UserDetails ?
                    <Box sx={{ marginLeft: "15%", marginRight: "15%" }}>
                        <PageHeader>
                            <PageHeader.TitleArea variant="large">
                                <PageHeader.LeadingVisual>
                                    <Avatar src={state.UserDetails.Avatar} size={32} alt={`${state.UserDetails.GlobalName} (@${state.UserDetails.Username})`} />
                                </PageHeader.LeadingVisual>
                                <PageHeader.Title>
                                    {state.UserDetails.GlobalName} (@{state.UserDetails.Username})
                                </PageHeader.Title>
                                <PageHeader.Actions>
                                    <Button size="large" variant="danger" onClick={() => { removeCookie("UserDetails"); removeCookie("Token"); setState({ ...state, UserDetails: null }); navigate("/"); }}>Log out</Button>
                                </PageHeader.Actions>
                            </PageHeader.TitleArea>
                        </PageHeader>
                        <Divider />
                        <Heading sx={{ marginBottom: 2 }}>Active Songs</Heading>
                        <Box className="songCategory">
                            <Song>
                                <center>Overriding: <Text sx={{ display: "block", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>Party Rock Anthem</Text></center>
                                <Button sx={{ width: "100%", marginTop: 2 }} variant="danger">Remove from Active</Button>
                            </Song>
                        </Box>
                        <Heading sx={{ marginTop: 2, marginBottom: 2 }}>My Bookmarks</Heading>
                        <Box className="songCategory">
                            <Song>
                                <Button sx={{ width: "100%", marginBottom: 1 }} variant="primary">Add to Active</Button>
                                <Button sx={{ width: "100%" }} variant="danger">Remove from Bookmarks</Button>
                            </Song>
                            <Song>
                                <Button sx={{ width: "100%", marginBottom: 1 }} disabled>Add to Active</Button>
                                <Button sx={{ width: "100%" }} variant="danger">Remove from Bookmarks</Button>
                            </Song>
                        </Box>
                    </Box> :
                    <>
                        <Text>You are not logged in.<br />Log in using the button in the top right.</Text>
                    </>
            }
        </>
    )
}