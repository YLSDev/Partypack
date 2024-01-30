import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SiteContext } from "../utils/State";
import { toast } from "react-toastify";
import { UserPermissions } from "../utils/Extensions";

export function VerifyRole({ children, role }: { children: JSX.Element, role: UserPermissions }) {
    const {state} = useContext(SiteContext);

    if (state.UserDetails?.Role < role)
    {
        toast("Your account does not have the Partypack role required to access this page. Try again later!", { type: "error" });
        return <Navigate to="/" replace />;
    }

    return children;
}