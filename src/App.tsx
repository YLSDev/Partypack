import { ToastContainer } from "react-toastify";
import { BaseStyles, ThemeProvider, theme } from "@primer/react";
import { SiteHeader } from "./components/SiteHeader";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Home } from "./routes/Home";
import { AdminTrackList } from "./routes/AdminTrackList";
import { AdminHome } from "./routes/AdminHome";
import { AdminLogin } from "./routes/AdminLogin";
import { VerifyAdmin } from "./components/VerifyAdmin";
import merge from "deepmerge";

import "react-toastify/dist/ReactToastify.css";
import "./css/index.css";

const DefaultTheme = merge(theme, {}); // we'll use this!! eventually!!!

function App() {
	return (
		<ThemeProvider colorMode="dark" theme={DefaultTheme}>
			<BaseStyles>
				<div>
					<CookiesProvider />
					<ToastContainer theme="dark" position="bottom-right" draggable={false} pauseOnHover={false} pauseOnFocusLoss={false} />
					<BrowserRouter>
						<SiteHeader />
						<div className="content">
							<Routes>
								{/* User-accessible routes */}
								<Route path="/" element={<Home />} />

								{/* Admin routes */}
								<Route path="/admin/login" element={<AdminLogin />} />
								<Route path="/admin" element={<VerifyAdmin><AdminHome /></VerifyAdmin>} />
								<Route path="/admin/tracks" element={<VerifyAdmin><AdminTrackList /></VerifyAdmin>} />
							</Routes>
						</div>
					</BrowserRouter>
				</div>
			</BaseStyles>
		</ThemeProvider>
	);
}

export default App;