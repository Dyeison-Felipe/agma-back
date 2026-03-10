export interface SupabaseService {
  uploadPdf(buffer: Buffer, fileName: string): Promise<string>
}