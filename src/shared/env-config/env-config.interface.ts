export interface EnvConfigService {
  getPort(): number;
  getServiceKeySupabase(): string;
  getDbHost(): string;
  getDbPort(): number;
  getDbUsername(): string;
  getDbName(): string;
  getDbPassword(): string;
  getMigrationRun(): boolean;
  getDbLogs(): boolean;
}
