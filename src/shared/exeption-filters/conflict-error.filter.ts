import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import type { FastifyReply, FastifyRequest } from 'fastify';
import { ConflictError } from '../errors/conflict-error';

@Catch(ConflictError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    reply.status(HttpStatus.CONFLICT).send({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: exception.message,
      path: request.url,
    });
  }
}
