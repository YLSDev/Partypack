import { Box, Heading, Text } from "@primer/react";

const FAQ: { Q: string, A: string }[] = [
    {
        Q: "Can custom jam tracks get me banned?",
        A: "No, custom songs do not interfere with Fortnite's anti-cheat and will NOT get you banned."
    },
    {
        Q: "How do custom jam tracks work?",
        A: "Using our custom launcher, Partypacker, you are able to redirect Fortnite's requests to the Partypack backend, which modifies Fortnite's tracklist. This allows us to replace existing jam tracks with completely custom jam tracks which include metadata, music, and charts."
    },
    {
        Q: "Can I play custom jam tracks with friends?",
        A: "Yes, you can! ...but they have to activate the exact same songs, replacing the exact same songs as you."
    },
    {
        Q: "Will stats save for custom jam tracks?",
        A: "Unfortunately, stats and leaderboards will not work for custom songs."
    },
    {
        Q: "Can I play jam tracks aleady inside Fortnite for free as a custom jam track?",
        A: "No, this is not currently allowed and will never be allowed on this instance."
    },
    {
        Q: "Do you have to chart every instrument on every difficulty for the custom jam track to work?",
        A: "No, you can chart as little as you want (or none at all) and the jam track will still load just fine. However, there currently is no way to disable a specific instrument or difficulty on a jam track."
    },
    {
        Q: "Does this have a token logger or spyware hidden inside?",
        A: "No! All our source code used for the server and launcher are available on McMistrzYT's GitHub. (links available on the home page)"
    }
];

export function FrequentlyAskedQuestions() {
    return (
        <Box>
            <Heading>Frequently Asked Questions</Heading>
            {
                FAQ.map(x => <>
                    <Text><b>Q:</b> {x.Q}</Text><br />
                    <Text><b>A:</b> {x.A}</Text><br /><br />
                </>)
            }
        </Box>
    )
}