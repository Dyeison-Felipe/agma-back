import { PROVIDERS } from '@/shared/constants/providers';
import { SupabaseService } from '@/shared/supabase/supabase.interface';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

@ApiTags('Storage')
@Controller('v1/storage')
export class StorageController {
  constructor(
    @Inject(PROVIDERS.SUPABASE_SERVICE)
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get('*')
  async getFile(@Param() params: { '*': string }, @Res() reply: FastifyReply) {
    const path = params['*'];

    if (!path || path.includes('..')) {
      throw new BadRequestException('Invalid file path');
    }

    let data: Blob;

    try {
      data = await this.supabaseService.download(path);
    } catch {
      throw new NotFoundException(`File not found: ${path}`);
    }

    if (!data) {
      throw new NotFoundException(`File not found: ${path}`);
    }

    const filename = path.split('/').pop() ?? 'file';
    const contentType = data.type || 'application/octet-stream';

    reply.header('Content-Type', contentType);
    reply.header('Content-Disposition', `inline; filename="${filename}"`);
    reply.header('Cache-Control', 'public, max-age=3600');

    const stream = data.stream();
    return reply.send(stream);
  }
}
