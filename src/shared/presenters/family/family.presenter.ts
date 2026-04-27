import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FamilyPresenter {
  @ApiProperty({ example: 'uuid-da-familia' })
  id: string;

  @ApiProperty({ example: 'familia@email.com' })
  email: string;

  @ApiProperty({ example: 'mae' })
  respondent: string;

  @ApiPropertyOptional({ example: null })
  respondentOther?: string;

  @ApiProperty({ example: '52998224725' })
  respondentCpf: string;

  @ApiProperty({ example: '1_salario' })
  familyIncome: string;

  @ApiProperty({ example: true })
  imageAuthorization: boolean;

  @ApiProperty({ example: '2' })
  numberOfChildren: string;

  @ApiProperty({ example: 'propria' })
  residenceType: string;

  @ApiPropertyOptional({ example: null })
  residenceTypeOther?: string;

  @ApiPropertyOptional({ example: '85010000' })
  cep?: string | null;

  @ApiProperty({ example: 'Rua das Flores' })
  street: string;

  @ApiProperty({ example: '123' })
  number: string;

  @ApiProperty({ example: 'Centro' })
  neighborhood: string;

  @ApiPropertyOptional({ example: 'Próximo ao mercado' })
  referencePoint?: string;

  @ApiProperty({ example: '42999999999' })
  motherPhone: string;

  @ApiPropertyOptional({ example: '42988888888' })
  fatherPhone?: string;

  @ApiPropertyOptional({ example: null })
  stepParentName?: string;

  @ApiProperty({ example: 'nao' })
  bpc: string;

  @ApiProperty({ example: false })
  crasRegistration: boolean;

  @ApiProperty({ example: true })
  municipalCard: boolean;

  @ApiProperty({ example: false })
  ciptea: boolean;

  @ApiProperty({ example: '2026-04-26T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-26T00:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  deletedAt?: Date;
}
