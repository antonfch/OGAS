import { SupabaseClient } from "@supabase/supabase-js";

import { decodeBase64, encodeBase64 } from "./base64Utils";


class RoomManager {
    supabase: SupabaseClient<any, "public", any>;

    constructor(supabase: SupabaseClient<any, "public", any>) {
        this.supabase = supabase;
    }

    private static fillRoomIdLength(roomId: string): string {
        return roomId.padStart(4, "0");
    }

    public getShortRoomId(roomId: string): number {
        return decodeBase64(roomId);
    }

    private async getLastRoomId(): Promise<number> {
        const lastRoomId = await this.supabase.from("rooms").select("id").order("id", { ascending: false }).limit(1);
        if (lastRoomId.data) {
            if (lastRoomId.data.length === 0)
                return -1;
            return lastRoomId.data[0].id as number;
        }
        return -1;
    }


    public async createNewRoomId(): Promise<string> {
        const newRoomId = await this.getLastRoomId() + 1;
        const newRoomIdShort = RoomManager.fillRoomIdLength(encodeBase64(newRoomId));

        await this.supabase.from("rooms").insert([{ id: newRoomId }]).select();
        return newRoomIdShort;
    }
}

export { RoomManager };