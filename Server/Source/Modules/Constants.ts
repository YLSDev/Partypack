export const PROJECT_NAME = process.env.PROJECT_NAME ?? "BasedServer"; // Default prefix for the logger module.
export const BODY_SIZE_LIMIT = process.env.BODY_SIZE_LIMIT ?? "10mb"; // Doesn't accept requests with body sizes larger than this value.
export const SERVER_URL = process.env.SERVER_URL ?? "localhost"; // The server's URL. Not used for a lot by default.
export const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "localhost:5173"; // The server's URL. Not used for a lot by default.
export const PORT = process.env.PORT ?? 80; // Port for the server to run on.
export const ENDPOINT_AUTHENTICATION_ENABLED = !!process.env.ENDPOINT_AUTHENTICATION; // Whether the server is locked down behind a header.
export const _ENDPOINT_AUTHENTICATION_ENV = process.env.ENDPOINT_AUTHENTICATION;
export const ENDPOINT_AUTH_HEADER = _ENDPOINT_AUTHENTICATION_ENV?.split(":")[0]; // Header name for endpoint auth.
export const ENDPOINT_AUTH_VALUE = _ENDPOINT_AUTHENTICATION_ENV?.split(":")[1]; // Value of the header for endpoint auth.
export const USE_HTTPS = false;//Boolean(process.env.USE_HTTPS); // todo: fix this shit
export const DASHBOARD_ROOT = `http${USE_HTTPS ? "s" : ""}://${DASHBOARD_URL}`; // A shortcut so that you don't need to type this out every time you wanna display the dashboard URL.
export const FULL_SERVER_ROOT = `http${USE_HTTPS ? "s" : ""}://${SERVER_URL}:${PORT}`; // A shortcut so that you don't need to type this out every time you wanna display the server URL.
export const COOKIE_SIGN_KEY = process.env.COOKIE_SIGN_KEY; // Secret that will be used to sign cookies.
export const ADMIN_KEY = process.env.ADMIN_KEY; // Secret that will be required to sign into the Admin Dashboard.

export const ENVIRONMENT = process.env.ENVIRONMENT ?? "dev";
export const IS_DEBUG = ENVIRONMENT.toLowerCase() === "dev" || ENVIRONMENT.toLowerCase() === "stage"; // IS_DEBUG can be used to enable test endpoints, unsafe code and more.