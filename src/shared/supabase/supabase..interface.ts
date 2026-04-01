export interface SupabaseService {
  uploadPdf(buffer: Buffer, fileName: string, storage: string): Promise<string>;
  deleteFileByUrl(url: string): Promise<void>;
  updatePdf(buffer: Buffer, fileName: string, storage: string): Promise<string>;
  deleteFolder(storage: string): Promise<void>;
}
