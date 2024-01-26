import { Box, Button, Dialog, Heading } from "@primer/react";
import { AdminCategory } from "../components/AdminCategory";
import { useEffect, useState } from "react";
import { moveElement } from "../utils/Extensions";
import { toast } from "react-toastify";
import axios from "axios";

export function AdminFeaturedTab() {
    const [library, setLibrary] = useState<{ ID: string, Header: string, Songs: unknown[], Custom: boolean, Priority: number }[] | null>(null);
    const [hackyRevertChanges, setHackyRevertChanges] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const Featured = await axios.get("/api/discovery");
            if (Featured.status !== 200)
                return toast("Something went wrong while loading discovery. Try again later.", { type: "error" });

            setLibrary(Featured.data);
        })();
    }, [hackyRevertChanges]);

    return (
        <>
            <Dialog></Dialog>
            <Heading>Featured Tabs</Heading>
            {
                library?.map((x, i) => {
                    return (
                        <AdminCategory
                            priority={x.Priority}
                            isForced={!x.Custom}
                            categoryName={x.Header}
                            songs={x.Songs}
                            moveDown={() => {
                                if (i + 1 >= library.length)
                                    return toast("You cannot move this category further down.", { type: "error" });

                                const Sorted = library.sort((a, b) => a.Priority - b.Priority);
                                
                                const Idx = Sorted.findIndex(y => y.ID === x.ID);
                                
                                console.log(Sorted);
                                moveElement(Idx, Idx + 1, Sorted);
                                console.log(Sorted);
                                
                                setLibrary(Sorted.map((y, idx, a) => { return {
                                    ...y,
                                    Priority:
                                        y.Custom ?
                                            (idx === 0 ? 0 : a[idx - 1].Priority + 1) :
                                            y.Priority
                                }; }));
                            }}
                            moveUp={() => {
                                if (i - 1 < 0)
                                    return toast("You cannot move this category further up.", { type: "error" });

                                const Sorted = library.sort((a, b) => a.Priority - b.Priority);
                                
                                const Idx = Sorted.findIndex(y => y.ID === x.ID);
                                
                                console.log(Sorted);
                                moveElement(Idx, Idx - 1, Sorted);
                                console.log(Sorted);
                                
                                setLibrary(Sorted.map((y, idx, a) => { return {
                                    ...y,
                                    Priority:
                                        y.Custom ?
                                            (idx === 0 ? 0 : a[idx - 1].Priority + 1) :
                                            y.Priority
                                }; }).sort((a, b) => a.Priority - b.Priority));
                            }}
                            onDelete={() => {

                            }} />
                    )
                })
            }
            <Box sx={{ float: "right", display: "inline-flex", gap: 2 }}>
                <Button variant="primary">Save</Button>
                <Button onClick={() => setHackyRevertChanges(!hackyRevertChanges)}>Revert changes</Button>
            </Box>
        </>
    )
}