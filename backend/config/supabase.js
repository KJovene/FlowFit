import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "⚠️  Supabase credentials not found. File uploads will not work."
  );
}

export const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The file name
 * @param {string} bucket - The storage bucket name
 * @param {string} contentType - The file MIME type
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadToSupabase = async (
  fileBuffer,
  fileName,
  bucket,
  contentType
) => {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
};

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - The file path in the bucket
 * @param {string} bucket - The storage bucket name
 */
export const deleteFromSupabase = async (filePath, bucket) => {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};
