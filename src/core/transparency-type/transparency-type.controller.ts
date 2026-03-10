import { Body, Controller, Post } from "@nestjs/common";
import { CreateTransparencyTypeDto } from "./dto/create-transparency-type.dto";
import { CreateTransparencyTypeUseCase } from "./usecase/create-transparency-type.usecase";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('TransparencyType')
@Controller('v1/transparency-type')
export class TransparencyTypeController {
  constructor(private readonly createTransparencyTypeUseCase: CreateTransparencyTypeUseCase) {}

  @Post()
  async create(@Body() dto: CreateTransparencyTypeDto) {
    return await this.createTransparencyTypeUseCase.execute(dto);
  }
}
