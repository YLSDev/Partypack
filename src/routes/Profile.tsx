import { ActionList, ActionMenu, Avatar, Box, Button, Dialog, Heading, Text } from "@primer/react"
import { Divider } from "@primer/react/lib-esm/ActionList/Divider";
import { PageHeader } from "@primer/react/drafts";
import { useContext, useEffect, useState } from "react";
import { SiteContext } from "../utils/State";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Song } from "../components/Song";
import axios from "axios";
import { toast } from "react-toastify";

export function Profile() {
	const { state, setState } = useContext(SiteContext);
	const [, , removeCookie] = useCookies();
	const [isActivateDialogOpen, setIsActivateDialogOpen] = useState<boolean>(false);
	const [librarySongs, setLibrarySongs] = useState<unknown[]>([]);
	const [bookmarkedSongs, setBookmarkedSongs] = useState<unknown[]>([]);
	const [availableOverrides, setAvailableOverrides] = useState<{ Name: string, Template: string }[]>([]);
	const [overriding, setOverriding] = useState<unknown>({});
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const Data = await axios.get("/api/library/me");
			const Overrides = await axios.get("/api/library/available");

			if (Data.status !== 200 || Overrides.status !== 200)
				return toast("An error has occured while getting your library!", { type: "error" });

			const LibSongs = (await Promise.all(Data.data.Library.map((x: { SongID: string; }) => axios.get(`/api/library/song/data/${x.SongID}`)))).map(x => { return { ...x.data, Override: Data.data.Library.find((y: { SongID: string; }) => y.SongID === x.data.ID).Overriding } });
			const BookSongs = (await Promise.all(Data.data.Bookmarks.map((x: { ID: string; }) => axios.get(`/api/library/song/data/${x.ID}`)))).map(x => x.data);
			setLibrarySongs(LibSongs);
			setBookmarkedSongs(BookSongs);
			setAvailableOverrides(Overrides.data);
		})();
	}, []);

	return (
		<>
			{
				state.UserDetails ?
					<Box>
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
						<Dialog isOpen={isActivateDialogOpen} onDismiss={() => setIsActivateDialogOpen(false)} aria-labelledby="header">
							<Dialog.Header id="header">Activate song</Dialog.Header>
							<Box p={3}>
								<Text>In order to activate a song for use, you need to sacrifice another song.<br />Please select a song you own to replace:</Text>
								<ActionMenu>
									<ActionMenu.Button>Select a song...</ActionMenu.Button>
									<ActionMenu.Overlay width="medium">
										<ActionList>
											{
												availableOverrides.map(x => {
													return <ActionList.Item onSelect={async () => {
														setIsActivateDialogOpen(false);
														const Res = await axios.post("/api/library/me/activate", { SongID: overriding!.ID!, ToOverride: x.Template });
														if (Res.status === 200)
															setLibrarySongs([
																...librarySongs,
																{ ...overriding!, Override: x.Template }
															])
														else
															toast(Res.data.errorMessage, { type: "error" })
													}}>
															{x.Name}
														</ActionList.Item>;
												})
											}
										</ActionList>
									</ActionMenu.Overlay>
								</ActionMenu>
							</Box>
						</Dialog>
						<Box className="songCategory">
							{
								librarySongs.length >= 1 ?
									librarySongs.map(x => {
										return <Song data={x}>
											<center>Overriding: <Text sx={{ display: "block", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{availableOverrides.find(y => y.Template.toLowerCase() === x.Override.toLowerCase())?.Name}</Text></center>
											<Button sx={{ width: "100%", marginTop: 2 }} variant="danger" onClick={async () => {
												const Res = await axios.post("/api/library/me/deactivate", { SongID: x.ID });
												if (Res.status === 200) {
													librarySongs.splice(librarySongs.findIndex(y => y.ID === x.ID), 1);
													setLibrarySongs([...librarySongs]);
												}
												else
													toast(Res.data.errorMessage, { type: "error" })
											}}>Remove from Active</Button>
										</Song>;
									})
									: <Text>You have no activated songs.</Text>
							}
						</Box>
						<Heading sx={{ marginTop: 2, marginBottom: 2 }}>My Bookmarks</Heading>
						<Box className="songCategory">
							{
								bookmarkedSongs.length >= 1 ?
									bookmarkedSongs.map(x => {
										return <Song data={x}>
											<Button sx={{ width: "100%", marginBottom: 1 }} variant="primary" onClick={() => { setIsActivateDialogOpen(true); setOverriding(x) }} disabled={librarySongs.findIndex(y => y.ID === x.ID) !== -1}>Add to Active</Button>
											<Button sx={{ width: "100%" }} variant="danger" onClick={async () => {
												const Res = await axios.post("/api/library/me/unbookmark", { SongID: x.ID });
												if (Res.status === 200) {
													bookmarkedSongs.splice(bookmarkedSongs.findIndex(y => y.ID === x.ID), 1);
													setBookmarkedSongs([...bookmarkedSongs]);
												}
												else
													toast(Res.data.errorMessage, { type: "error" })
											}}>Remove from Bookmarks</Button>
										</Song>;
									})
									: <Text>You have no bookmarked songs.</Text>
							}
						</Box>
					</Box> :
					<>
						<Text>You are not logged in.<br />Log in using the button in the top right.</Text>
					</>
			}
		</>
	)
}