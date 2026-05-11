import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { FamilyRepository } from '@/core/family/family.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { ConflictError } from '@/shared/errors/conflict-error';
import { AutisticOutput } from '@/shared/output/autistic/autistic.output';
import { FamilyOutput } from '@/shared/output/family/family.output';
import { UseCase } from '@/shared/usecase/usecase';
import { cleanCEP } from '@/shared/utils/clean-cep';
import { isValidCPF } from '@/shared/utils/validate-cpf';
import { Inject } from '@nestjs/common';

type Input = {
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

export class CreateFormUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.AUTISTIC_CHILD_REPOSITORY)
    private readonly autistChildRepository: AutisticChildRepository,
    @Inject(PROVIDERS.FAMILY_REPOSITORY)
    private readonly familyRepository: FamilyRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<Output> {
    const existFamily = await this.familyRepository.findByCpf(
      input.respondentCpf,
    );

    if (existFamily) {
      throw new ConflictError(
        `Essa família já está cadastrada com o CPF informado`,
      );
    }

    const cpfClean = isValidCPF(input.respondentCpf);
    const cepClean = input.cep ? cleanCEP(input.cep) : undefined;

    const savedFamily = await this.familyRepository.save({
      id: crypto.randomUUID(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedAutisticChildren = await Promise.all(
      input.autistic_children.map((child) =>
        this.autistChildRepository.save({
          id: crypto.randomUUID(),
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
          family: savedFamily,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
    );

    const output: Output = {
      family: savedFamily,
      autisticChildren: savedAutisticChildren,
    };

    return output;
  }
}
