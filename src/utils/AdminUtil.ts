import { AxInstance } from "./Requests";

export async function VerifyAdminKey(Key: string): Promise<{ Success: boolean; Message: string; }> {
    const { status, data } = await AxInstance.post("/admin/api/key", { Key });
    return { Success: status === 200, Message: data };
}