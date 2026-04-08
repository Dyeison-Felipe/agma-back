export interface EnvConfigService {
  getSalts(): number;
  // getAllowedOrigins(): string[]
  getPort(): number;
  getSupabaseKey(): string;
  getSupabaseUrl(): string;
  getDbHost(): string;
  getDbPort(): number;
  getDbUsername(): string;
  getDbName(): string;
  getDbPassword(): string;
  getMigrationRun(): boolean;
  getDbLogs(): boolean;
  getAllowedOrigins(): string[];
  getApiUrl(): string;
}
