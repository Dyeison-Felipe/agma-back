import { PartialType } from '@nestjs/swagger';
import { CreateTransparencyTypeDto } from './create-transparency-type.dto';

export class UpdateTransparencyTypeDto extends PartialType(CreateTransparencyTypeDto) {}
