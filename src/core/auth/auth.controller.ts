import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LoginUseCase } from "./usecase/login.usecase";
import { LoginDto } from "./usecase/dto/login.dto";
import { LoginPresenter } from "@/shared/presenters/auth/login.presenter";
import { FastifyReply } from "fastify";

@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ description: 'Login realizado com sucesso', type: LoginPresenter })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  async login(
    @Res({ passthrough: true }) reply: FastifyReply,
    @Body() loginRequestDto: LoginDto,
  ): Promise<LoginPresenter> {
    return await this.loginUseCase.execute({
      ...loginRequestDto,
      setCookie: reply.setCookie.bind(reply),
    });
  }
}
