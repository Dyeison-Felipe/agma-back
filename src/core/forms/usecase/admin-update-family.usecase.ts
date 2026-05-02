import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { FamilyRepository } from '@/core/family/family.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { AutisticOutput } from '@/shared/output/autistic/autistic.output';
import { FamilyOutput } from '@/shared/output/family/family.output';
import { UseCase } from '@/shared/usecase/usecase';
import { cleanCEP } from '@/shared/utils/clean-cep';
import { isValidCPF } from '@/shared/utils/validate-cpf';
import { Inject } from '@nestjs/common';

type Input = {
  id: string;
  email: string;
  respondent: string;
  respondentOther?: string;
  respondentCpf: string;
  familyIncome: string;
  imageAuthorization: boolean;
  numberOfChildren: string;
  residenceType: string;
  residenceTypeOther?: string;
  cep?: string;
  street: string;
  number: string;
  neighborhood: string;
  referencePoint?: string;
  motherPhone: string;
  fatherPhone?: string;
  stepParentName?: string;
  bpc: string;
  crasRegistration: boolean;
  municipalCard: boolean;
  ciptea: boolean;
  autistic_children: {
    id: string;
    fullName: string;
    birthDate: string;
    gender: string;
    motherName: string;
    fatherName: string;
    autismCondition: string;
    supportLevel: string;
    comorbidities: string;
    comorbiditiesOther?: string;
    multiprofessionalSupport: boolean;
    usesMedication: boolean;
    medicationNames?: string;
    schoolGrade: string;
    schoolName: string;
  }[];
};

type Output = {
  family: FamilyOutput;
  autisticChildren: AutisticOutput[];
};

export class AdminUpdateFamilyUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.AUTISTIC_CHILD_REPOSITORY)
    private readonly autistChildRepository: AutisticChildRepository,
    @Inject(PROVIDERS.FAMILY_REPOSITORY)
    private readonly familyRepository: FamilyRepository,
    @Inject(PROVIDERS.JWT_SERVICE) private readonly jwtService: JwtService,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<Output> {
    const family = await this.familyRepository.findById(input.id);

    if (!family) {
      throw new NotFoundError(`Família não encontrada`);
    }

    const cpfClean = isValidCPF(input.respondentCpf);
    const cepClean = input.cep ? cleanCEP(input.cep) : undefined;

    family.updateToken = null;

    const updatedFamily = await this.familyRepository.save({
      ...family,
      email: input.email,
      respondent: input.respondent,
      respondentOther: input.respondentOther,
      respondentCpf: cpfClean,
      familyIncome: input.familyIncome,
      imageAuthorization: input.imageAuthorization,
      numberOfChildren: input.numberOfChildren,
      residenceType: input.residenceType,
      residenceTypeOther: input.residenceTypeOther,
      cep: cepClean,
      street: input.street,
      number: input.number,
      neighborhood: input.neighborhood,
      referencePoint: input.referencePoint,
      motherPhone: input.motherPhone,
      fatherPhone: input.fatherPhone,
      stepParentName: input.stepParentName,
      bpc: input.bpc,
      crasRegistration: input.crasRegistration,
      municipalCard: input.municipalCard,
      ciptea: input.ciptea,
      updatedAt: new Date(),
    });

    const updatedChildren = await Promise.all(
      input.autistic_children.map((child) => {
        const existingChild = family.autisticChild?.find(
          (c) => c.id === child.id,
        );

        return this.autistChildRepository.update({
          ...existingChild,
          id: child.id,
          fullName: child.fullName,
          birthDate: child.birthDate,
          gender: child.gender,
          motherName: child.motherName,
          fatherName: child.fatherName,
          autismCondition: child.autismCondition,
          supportLevel: child.supportLevel,
          comorbidities: child.comorbidities,
          comorbiditiesOther: child.comorbiditiesOther,
          multiprofessionalSupport: child.multiprofessionalSupport,
          usesMedication: child.usesMedication,
          medicationNames: child.medicationNames,
          schoolGrade: child.schoolGrade,
          schoolName: child.schoolName,
          family: updatedFamily,
          createdAt: existingChild?.createdAt!,
          updatedAt: new Date(),
        });
      }),
    );

    const output: Output = {
      family: updatedFamily,
      autisticChildren: updatedChildren,
    };

    return output;
  }
}
