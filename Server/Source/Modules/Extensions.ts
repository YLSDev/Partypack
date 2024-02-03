// https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
export async function AsyncFilter(arr: unknown[], predicate: (value: unknown, index: number, array: unknown[]) => Promise<boolean>) {
    return Promise.all(arr.map(predicate)).then((results) => arr.filter((_v, index) => results[index]));
}