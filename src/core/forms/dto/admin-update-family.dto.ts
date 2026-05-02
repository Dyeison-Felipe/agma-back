import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class AutisticChildDto {
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '2015-06-15' })
  @IsString()
  birthDate: string;

  @ApiProperty({ example: 'masculino' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  motherName: string;

  @ApiProperty({ example: 'José da Silva' })
  @IsString()
  fatherName: string;

  @ApiProperty({ example: 'leve' })
  @IsString()
  autismCondition: string;

  @ApiProperty({ example: 'nivel_1' })
  @IsString()
  supportLevel: string;

  @ApiProperty({ example: 'tdah' })
  @IsString()
  comorbidities: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  comorbiditiesOther?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  multiprofessionalSupport: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  usesMedication: boolean;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  medicationNames?: string;

  @ApiProperty({ example: '4_ano' })
  @IsString()
  schoolGrade: string;

  @ApiProperty({ example: 'Escola Municipal Centro' })
  @IsString()
  schoolName: string;
}

export class AdminUpdateFamilyFormDto {
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'familia@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'mae' })
  @IsString()
  respondent: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  respondentOther?: string;

  @ApiProperty({ example: '529.982.247-25' })
  @IsString()
  respondentCpf: string;

  @ApiProperty({ example: '1_salario' })
  @IsString()
  familyIncome: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  imageAuthorization: boolean;

  @ApiProperty({ example: '2' })
  @IsString()
  numberOfChildren: string;

  @ApiProperty({ example: 'propria' })
  @IsString()
  residenceType: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  residenceTypeOther?: string;

  @ApiPropertyOptional({ example: '85010-000' })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  street: string;

  @ApiProperty({ example: '123' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  neighborhood: string;

  @ApiPropertyOptional({ example: 'Próximo ao mercado' })
  @IsOptional()
  @IsString()
  referencePoint?: string;

  @ApiProperty({ example: '42999999999' })
  @IsString()
  motherPhone: string;

  @ApiPropertyOptional({ example: '42988888888' })
  @IsOptional()
  @IsString()
  fatherPhone?: string;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  stepParentName?: string;

  @ApiProperty({ example: 'nao' })
  @IsString()
  bpc: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  crasRegistration: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  municipalCard: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  ciptea: boolean;

  @ApiProperty({ type: [AutisticChildDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutisticChildDto)
  autistic_children: AutisticChildDto[];
}
