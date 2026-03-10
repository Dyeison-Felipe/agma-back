import { Module } from "@nestjs/common";
import { PROVIDERS } from "../constants/providers";
import { SupabaseServiceImpl } from "./supabase.service";

@Module({
  imports: [],
  providers: [
    {
      provide: PROVIDERS.SUPABASE_SERVICE,
      useClass: SupabaseServiceImpl
    }
  ],
  exports: [PROVIDERS.SUPABASE_SERVICE]
})
export class SupabaseModule {}