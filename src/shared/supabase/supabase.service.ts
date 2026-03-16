import { Inject, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PROVIDERS } from '../constants/providers';
import type { EnvConfigService } from '../env-config/env-config.interface';
import { SupabaseService } from './supabase..interface';
import { SupabaseStorages } from '../enums/supabase-storages.enum';

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

  async uploadPdf(buffer: Buffer, fileName: string, storage: SupabaseStorages): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(`agma/${storage}`)
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrl } = this.supabase.storage
      .from(`agma/${storage}`)
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  }

  async updatePdf(
  buffer: Buffer,
  fileName: string,
  storage: SupabaseStorages,
): Promise<string> {
  const { error } = await this.supabase.storage
    .from(`agma/${storage}`)
    .upload(fileName, buffer, {
      contentType: 'application/pdf',
      upsert: true, // sobrescreve arquivo existente
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrl } = this.supabase.storage
    .from(`agma/${storage}`)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

  async deleteFile(fileName: string, storage: SupabaseStorages): Promise<void> {
  const { error } = await this.supabase.storage
    .from(`agma/${storage}`)
    .remove([fileName]);

  if (error) {
    throw new Error(error.message);
  }
}
}
