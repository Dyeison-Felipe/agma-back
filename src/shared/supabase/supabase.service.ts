import { Inject, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PROVIDERS } from '../constants/providers';
import type { EnvConfigService } from '../env-config/env-config.interface';
import { SupabaseService } from './supabase.interface';

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
          fetch: (...args) => fetch(...args),
        },
      },
    );
    this.url = envConfig.getSupabaseUrl();
    this.key = envConfig.getSupabaseKey();
  }

  private normalizePath(path: string): string {
    return path
      .split('/') // separa pastas
      .map((part) =>
        part
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // remove acento
          .replace(/\s+/g, '-') // espaço -> hífen
          .toLowerCase(),
      )
      .join('/');
  }

  async uploadPdf(
    buffer: Buffer,
    fileName: string,
    storage: string,
  ): Promise<string> {
    const safeStorage = this.normalizePath(storage);

    const { error } = await this.supabase.storage
      .from(`agma/${safeStorage}`)
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
      });

    if (error) {
      throw new Error(error.message);
    }

    return `agma/${safeStorage}/${fileName}`;
  }

  async updatePdf(
    buffer: Buffer,
    fileName: string,
    storage: string,
  ): Promise<string> {
    const safeStorage = this.normalizePath(storage);

    const { error } = await this.supabase.storage
      .from(`agma/${safeStorage}`)
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrl } = this.supabase.storage
      .from(`agma/${safeStorage}`)
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  }

  async deleteFileByUrl(url: string): Promise<void> {
    const marker = 'agma/';
    const idx = url.indexOf(marker);

    if (idx === -1) {
      throw new Error('URL inválida');
    }

    const fullPath = url.slice(idx + marker.length);
    // fullPath = "transparency-portal/9f3286ca-dc71-42cb-b386-11dc818b1ffb.png"

    const { error } = await this.supabase.storage
      .from('agma')
      .remove([fullPath]); // o remove aceita o path completo dentro do bucket

    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteFolder(storage: string): Promise<void> {
    const safeStorage = this.normalizePath(storage);

    // 1. listar arquivos dentro da "pasta"
    const { data: files, error: listError } = await this.supabase.storage
      .from('agma') // bucket
      .list(safeStorage, {
        // folder
        limit: 1000,
      });

    if (listError) {
      throw new Error(listError.message);
    }

    if (!files || files.length === 0) {
      return;
    }

    // 2. montar caminho completo dos arquivos
    const filePaths = files.map((file) => `${safeStorage}/${file.name}`);

    // 3. deletar
    const { error: deleteError } = await this.supabase.storage
      .from('agma') // bucket
      .remove(filePaths); // folder

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  getUrl(path: string): string {
    return `${this.envConfig.getSupabaseUrl()}/storage/v1/object/public/${path}`;
  }

  async download(path: string): Promise<Blob> {
    const [bucket, ...pathParts] = path.split('/');

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(pathParts.join('/'));

    if (!data || error) {
      throw new Error(JSON.stringify(error));
    }

    return data;
  }
}
