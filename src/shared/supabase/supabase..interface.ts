import { SupabaseStorages } from "../enums/supabase-storages.enum";

export interface SupabaseService {
  uploadPdf(buffer: Buffer, fileName: string, storage: SupabaseStorages): Promise<string>;
  deleteFile(fileName: string, storage: SupabaseStorages): Promise<void>;
  updatePdf(
  buffer: Buffer,
  fileName: string,
  storage: SupabaseStorages,
): Promise<string>;
}