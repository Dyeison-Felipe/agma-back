import { EnvConfigService } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

export class EnvConfigServiceImpl implements EnvConfigService {
  constructor(private readonly configService: ConfigService) {}
  // getAllowedOrigins(): string[] {
  //   return (this.configService.get<string>('ALLOWED_ORIGIN')as string).split(',');
  // }

  getPort(): number {
    return +(this.configService.get<string>('PORT') as string);
  }

  getDbHost(): string {
    return this.configService.get<string>('DB_HOST') as string;
  }

  getDbPort(): number {
    return +(this.configService.get<string>('DB_PORT') as string);
  }

  getDbUsername(): string {
    return this.configService.get<string>('DB_USER') as string;
  }

  getDbName(): string {
    return this.configService.get<string>('DB_NAME') as string;
  }

  getDbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD') as string;
  }

  getMigrationRun(): boolean {
    return this.configService.get<string>('MIGRATION_RUN') === 'true';
  }

  getDbLogs(): boolean {
    return this.configService.get<string>('DB_LOGS') === 'true';
  }

  getSupabaseKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_KEY') as string;
  }

  getSupabaseUrl(): string {
    return this.configService.get<string>('SUPABASE_URL') as string;
  }
}
