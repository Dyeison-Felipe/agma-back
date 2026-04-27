import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AutisticPresenter {
  @ApiProperty({ example: 'uuid-da-crianca' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  fullName: string;

  @ApiProperty({ example: '2015-06-15' })
  birthDate: string;

  @ApiProperty({ example: 'masculino' })
  gender: string;

  @ApiProperty({ example: 'Maria da Silva' })
  motherName: string;

  @ApiProperty({ example: 'José da Silva' })
  fatherName: string;

  @ApiProperty({ example: 'leve' })
  autismCondition: string;

  @ApiProperty({ example: 'nivel_1' })
  supportLevel: string;

  @ApiProperty({ example: 'tdah' })
  comorbidities: string;

  @ApiPropertyOptional({ example: null })
  comorbiditiesOther?: string;

  @ApiProperty({ example: true })
  multiprofessionalSupport: boolean;

  @ApiProperty({ example: false })
  usesMedication: boolean;

  @ApiPropertyOptional({ example: null })
  medicationNames?: string;

  @ApiProperty({ example: '4_ano' })
  schoolGrade: string;

  @ApiProperty({ example: 'Escola Municipal Centro' })
  schoolName: string;

  @ApiProperty({ example: '2026-04-26T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-26T00:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  deletedAt?: Date;
}
