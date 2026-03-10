import { PartialType } from '@nestjs/swagger';
import { CreateTransparencyPortalDto } from './create-transparency-portal.dto';

export class UpdateTransparencyPortalDto extends PartialType(CreateTransparencyPortalDto) {}
