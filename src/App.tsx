import "./utils/Requests";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { BaseStyles, ThemeProvider, theme } from "@primer/react";
import { SiteHeader } from "./components/SiteHeader";
import { VerifyAdmin } from "./components/VerifyAdmin";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Home } from "./routes/Home";
import { Download } from "./routes/Download";
import { Tracks } from "./routes/Tracks";
import { TrackSubmission } from "./routes/TrackSubmission";
import { Profile } from "./routes/Profile";
import { NotFound } from "./routes/404";
import { AdminHome } from "./routes/AdminHome";
import { AdminTrackList } from "./routes/AdminTrackList";
import { AdminCreateTrack } from "./routes/AdminCreateTrack";
import { AdminFeaturedTab } from "./routes/AdminFeaturedTab";
import { SiteContext, SiteState } from "./utils/State";
import merge from "deepmerge";

import "react-toastify/dist/ReactToastify.css";
import "./css/index.css";

const DefaultTheme = merge(theme, {}); // we'll use this!! eventually!!!

function App() {
	const [reactState, setReactState] = useState<SiteState>({} as SiteState);

	return (
		<ThemeProvider colorMode="dark" theme={DefaultTheme}>
			<BaseStyles>
				<div>
					<CookiesProvider />
					<ToastContainer theme="dark" position="bottom-right" draggable={false} pauseOnHover={false} pauseOnFocusLoss={false} />
					<BrowserRouter>
						<SiteContext.Provider value={{ state: reactState, setState: setReactState }}>
							<SiteHeader />
							<div className="content">
								<Routes>
									{/* User-accessible routes */}
									<Route path="/" element={<Home />} />
									<Route path="/download" element={<Download />} />
									<Route path="/tracks" element={<Tracks />} />
									<Route path="/submissions" element={<TrackSubmission />} />
									<Route path="/profile" element={<Profile />} />
									<Route path="*" element={<NotFound />} />

									{/* Admin routes */}
									<Route path="/admin" element={<VerifyAdmin><AdminHome /></VerifyAdmin>} />
									<Route path="/admin/tracks" element={<VerifyAdmin><AdminTrackList /></VerifyAdmin>} />
									<Route path="/admin/tracks/create" element={<VerifyAdmin><AdminCreateTrack /></VerifyAdmin>} />
									<Route path="/admin/featured" element={<VerifyAdmin><AdminFeaturedTab /></VerifyAdmin>} />
								</Routes>
							</div>
						</SiteContext.Provider>
					</BrowserRouter>
				</div>
			</BaseStyles>
		</ThemeProvider>
	);
}

export default App;