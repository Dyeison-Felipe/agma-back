import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { extname } from 'node:path';
import { FileDto } from '../dto/file.dto';

@Injectable()
export class ParseMultipartInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

// Fazemos um casting para 'any' apenas na chamada do método para o TS parar de reclamar
const parts = (request as any).parts();

    const result: Record<string, any> = {};

    for await (const part of parts) {
      console.log("PART:", part);
      if (part.type === 'file') {
        const buffer = await part.toBuffer();

        // TODO Adicionar essa validação em um guard, considerando os tamanhos salvos no banco
        // if (this.maxSizeInBytes && buffer.length > this.maxSizeInBytes) {
        //   throw new BadRequestException(
        //     `The file '${part.fieldname}' exceeded the size limit ${this.maxSizeInBytes / 1024 / 1024} MB`,
        //   );
        // }

        const extension = extname(part.filename);

        const file: FileDto = {
          buffer,
          filename: part.filename,
          extension,
        };

        if (result[part.fieldname]) {
          // Se já existe, transforma em array
          if (Array.isArray(result[part.fieldname])) {
            result[part.fieldname].push(file);
          } else {
            result[part.fieldname] = [result[part.fieldname], file];
          }
        } else {
          result[part.fieldname] = file;
        }
      } else {
        try {
          result[part.fieldname] = JSON.parse(part.value as string);
        } catch {
          result[part.fieldname] = part.value;
        }
      }
    }

    console.log("RESULT:", result);

    request.body = result;

    return next.handle().pipe(map((data) => data));
  }
}