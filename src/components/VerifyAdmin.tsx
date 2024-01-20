import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export function VerifyAdmin({ children }: { children: JSX.Element }) {
    const [cookies] = useCookies();

    if (!cookies["AdminKey"])
        return <Navigate to="/admin/login" replace />;

    return children;
}