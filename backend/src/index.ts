import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import { RoomManager } from "./room/RoomManager";



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())


const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const roomManager = new RoomManager(supabase);

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);

    // Rooms testing
    console.log(await roomManager.createNewRoomId());
    console.log(await roomManager.createNewRoomId());
    console.log(await roomManager.createNewRoomId());

    process.exit(0);
});
