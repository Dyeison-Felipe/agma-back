export interface EnvConfigService {
  // getAllowedOrigins(): string[]
  getPort(): number;
  getSupabaseKey(): string;
  getSupabaseUrl(): string
  getDbHost(): string;
  getDbPort(): number;
  getDbUsername(): string;
  getDbName(): string;
  getDbPassword(): string;
  getMigrationRun(): boolean;
  getDbLogs(): boolean;
}
