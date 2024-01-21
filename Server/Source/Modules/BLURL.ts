// massive shoutout to yls for providing me with the blurl standard doc :fire:

import { deflateSync, inflateSync } from "zlib";

export function CreateBlurl(Data: unknown) { // mildly unsafe
    const Buf = Buffer.from(JSON.stringify(Data));
    const DefBuf = deflateSync(Buf);
    const Length = Buffer.alloc(4);
    Length.writeIntBE(Buf.toString().length, 0, 4)

    return Buffer.concat([Buffer.from("blul"), Length, DefBuf]);
}

export function DeBlurl(Data: Buffer) { // i have absolutely ZERO clue whether this works so do not try it
    const Buf = inflateSync(Data.subarray(4));

    return Buf;
}