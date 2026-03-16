import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTransparencyTypeDto } from "./dto/create-transparency-type.dto";
import { CreateTransparencyTypeUseCase } from "./usecase/create-transparency-type.usecase";
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTransparencyTypePresenter } from "@/shared/presenters/transparency-type/create-transparency-type.presenter";
import { FindAllTransparencyTypeUseCase } from "./usecase/find-all-transparency.usecase";
import { FindAllTransparencyTypePresenter } from "@/shared/presenters/transparency-type/find-all-transparency-type.presenter";

@ApiTags('TransparencyType')
@Controller('v1/transparency-type')
export class TransparencyTypeController {
  constructor(private readonly createTransparencyTypeUseCase: CreateTransparencyTypeUseCase, private readonly findAllTransparencyTypeUseCase: FindAllTransparencyTypeUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar um tipo de transparência' })
  @ApiBody({
    type: CreateTransparencyTypeDto,
    description: 'Dados para criação do tipo de transparência'
  })

  @ApiCreatedResponse({
    description: 'Tipo de transparência criado com sucesso',
    type: CreateTransparencyTypePresenter
  })
  @ApiConflictResponse({
    description: 'Tipo de transparência já existe'
  })
  async create(@Body() dto: CreateTransparencyTypeDto): Promise<CreateTransparencyTypePresenter> {
    return await this.createTransparencyTypeUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os tipos de transparência' })
  @ApiOkResponse({
    description: 'Tipos de transparência encontrado com sucesso',
    type: FindAllTransparencyTypePresenter,
    isArray: true,
  })
  async findAll(): Promise<FindAllTransparencyTypePresenter[]> {
    return await this.findAllTransparencyTypeUseCase.execute();
  }
}
