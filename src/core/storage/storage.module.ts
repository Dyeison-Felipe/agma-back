import { SupabaseModule } from '@/shared/supabase/supabase.module';
import { StorageController } from './storage.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [SupabaseModule],
  controllers: [StorageController],
  providers: [],
})
export class StorageModule {}
