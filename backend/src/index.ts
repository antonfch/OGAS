import express, { Request, Response } from "express";

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/Test", async (req: Request, res: Response) => {
  const { data: test, error } = await supabase.from("test").select("test");
  if (error) {
    return res.status(400).json(error);
  }
  return res.status(200).json(test);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
