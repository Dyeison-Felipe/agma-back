import { PartialType } from '@nestjs/swagger';
import { CreateAutistDto } from './create-autist.dto';

export class UpdateAutistDto extends PartialType(CreateAutistDto) {}
