import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

const supabaseUrl = process.env.SUPABASE_URL || "https://hiaixohzylempotzepgi.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKETS = {
  PROFILE: process.env.SUPABASE_BUCKET_PROFILE || "profile-image",
  DOCUMENTS: process.env.SUPABASE_BUCKET_DOCUMENTS || "documents",
  CHAT: process.env.SUPABASE_BUCKET_CHAT || "chat-files",
};
