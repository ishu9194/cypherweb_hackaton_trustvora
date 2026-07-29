import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://hiaixohzylempotzepgi.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKETS = {
  PROFILE: import.meta.env.VITE_SUPABASE_BUCKET_PROFILE || "profile-image",
  DOCUMENTS: import.meta.env.VITE_SUPABASE_BUCKET_DOCUMENTS || "documents",
  CHAT: import.meta.env.VITE_SUPABASE_BUCKET_CHAT || "chat-files",
};

/**
 * Uploads a File directly to a specified Supabase bucket and returns the public URL.
 */
export async function uploadToSupabase(
  file: File,
  bucketName: string = BUCKETS.PROFILE,
  folder: string = ""
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder ? folder + "/" : ""}${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
