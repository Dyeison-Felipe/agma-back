// src/shared/guards/roles.guard.ts
import { ROLES_KEY } from '@/shared/decorators/role.decorator';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector)
    private readonly reflector: Reflector,) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user;

    if (!user) throw new UnauthorizedError('Usuário não encontrado na requisição');

    const hasRole = requiredRoles.includes(user.role.name);

    if (!hasRole) throw new UnauthorizedError('Sem permissão para acessar esse recurso');

    return hasRole;
  }
}