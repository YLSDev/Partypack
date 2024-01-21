import { Box, Button, Text, TextInput } from "@primer/react";
import { useEffect, useRef, useState } from "react";
import { VerifyAdminKey } from "../utils/AdminUtil";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();
    const KeyInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (cookies["AdminKey"])
            navigate("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box>
            <center>
                <Text>Provide the top secret admin key defined in the environment below:</Text><br />
                <TextInput ref={KeyInputRef} size="large" sx={{ minWidth: 400, maxWidth: 600 }} monospace={true} validationStatus={success ? "success" : "error"} />
                <Button variant="primary" onClick={
                    async () => {
                        const Key = KeyInputRef.current!.value;
                        const Result = await VerifyAdminKey(Key);
                        setSuccess(Result.Success);
                        setErrorMessage(Result.Message);
                        
                        const D = new Date();
                        D.setUTCHours(D.getUTCHours() + 4);
                        if (Result.Success)
                        {
                            setCookie("AdminKey", Key, { expires: D });
                            navigate("/admin");
                            return;
                        }

                        removeCookie("AdminKey");
                    }
                }>Log in</Button>
                {
                    errorMessage !== "" ? (
                        <Text sx={{ color: success ? "primary.emphasis" : "danger.emphasis" }}>{errorMessage}</Text>
                    ) : <></>
                }
            </center>
        </Box>
    )
}