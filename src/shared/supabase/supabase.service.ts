import { Inject, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PROVIDERS } from '../constants/providers';
import type { EnvConfigService } from '../env-config/env-config.interface';
import { SupabaseService } from './supabase..interface';

@Injectable()
export class SupabaseServiceImpl implements SupabaseService {
  private supabase;
  private url;
  private key;

  constructor(
    @Inject(PROVIDERS.ENV_CONFIG_SERVICE)
    private readonly envConfig: EnvConfigService,
  ) {
    this.supabase = createClient(
      envConfig.getSupabaseUrl(),
      envConfig.getSupabaseKey(),
      {
        auth: {
          persistSession: false,
        },
        global: {
          // Isso garante que o fetch não tenha problemas de timeout ou DNS
          fetch: (...args) => fetch(...args),
        },
      },
    );
    this.url = envConfig.getSupabaseUrl();
    this.key = envConfig.getSupabaseKey();
  }

  async uploadPdf(buffer: Buffer, fileName: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('agma')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrl } = this.supabase.storage
      .from('agma')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  }
}
