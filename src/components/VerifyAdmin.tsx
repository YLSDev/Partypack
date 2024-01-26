import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SiteContext } from "../utils/State";
import { toast } from "react-toastify";

export function VerifyAdmin({ children }: { children: JSX.Element }) {
    const {state} = useContext(SiteContext);

    if (!state.UserDetails?.IsAdmin)
    {
        toast("Your account does not have admin permissions required to access this page. Try again later!", { type: "error" });
        return <Navigate to="/" replace />;
    }

    return children;
}