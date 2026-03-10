import { Inject, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PROVIDERS } from '../constants/providers';
import type { EnvConfigService } from '../env-config/env-config.interface';
import { SupabaseService } from './supabase..interface';

@Injectable()
export class SupabaseServiceImpl implements SupabaseService {
  private supabase;

  constructor(
    @Inject(PROVIDERS.ENV_CONFIG_SERVICE)
    private readonly envConfig: EnvConfigService,
  ) {
    this.supabase = createClient(
      envConfig.getSupabaseUrl(),
      envConfig.getSupabaseKey(),
    );
  }

  async uploadPdf(buffer: Buffer, fileName: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('pdf-files')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data: publicUrl } = this.supabase.storage
      .from('pdf-files')
      .getPublicUrl(fileName)

    return publicUrl.publicUrl
  }
}
