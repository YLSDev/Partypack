export function moveElement(fromIndex: number, toIndex: number, array: unknown[]) {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
}