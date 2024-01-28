import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export function AdminSubmissions() {
    useEffect(() => {
		(async () => {
			const Data = await axios.get("/api/admin/");
			const Overrides = await axios.get("/api/library/available");

			if (Data.status !== 200 || Overrides.status !== 200)
				return toast("An error has occured while getting the submitted songs!", { type: "error" });

            
		})();
	}, []);

    return (
        <>
        </>
    )
}