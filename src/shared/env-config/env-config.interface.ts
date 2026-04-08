export interface EnvConfigService {
  getCookieSecret(): string;
  getCookieSameSite(): string;
  getCookieSecure(): boolean;
  getCookieDomain(): string;
  getJwtSecret(): string;
  getJwtSecret(): string;
  getJwtExpiresInSeconds(): number;
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
