export function moveElement(fromIndex: number, toIndex: number, array: unknown[]) {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
}

export enum SongStatus {
    BROKEN = -100,
    DEFAULT = 0,
    PROCESSING = 100,
    PUBLIC = 200,
    AWAITING_REVIEW = 300,
    ACCEPTED = 400,
    DENIED = 500
}

export enum UserPermissions {
    User = 100,
    VerifiedUser = 200,
    TrackVerifier = 250,
    Moderator = 300,
    Administrator = 400
}