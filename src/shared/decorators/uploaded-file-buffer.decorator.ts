import { MultipartFile } from '@fastify/multipart';
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const UploadedFileBuffer = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const file = await (request as FastifyRequest & { file: () => Promise<MultipartFile> }).file();

    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const buffer = await file.toBuffer();

    return buffer;
  },
);