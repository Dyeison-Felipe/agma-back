import { FamilyRepository } from '@/core/family/family.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { AutisticOutput } from '@/shared/output/autistic/autistic.output';
import { FamilyOutput } from '@/shared/output/family/family.output';
import { Pagination } from '@/shared/presenters/pagination/pagination.presenter';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

export type Input = {
  cpf?: string;
  pagination: PaginationDto;
};

type Familys = {
  family: FamilyOutput;
  autisticChildren: AutisticOutput[];
};

export type Output = Pagination<Familys>;

export class FindAllFamilysPaginatedUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.FAMILY_REPOSITORY)
    private readonly familyRepository: FamilyRepository,
  ) {}

  async execute({ cpf, pagination }: Input): Promise<Output> {
    const familys = await this.familyRepository.findAllPaginated(
      pagination,
      cpf,
    );

    const items = familys.items.map((item) => ({
      family: {
        id: item.id,
        email: item.email,
        respondent: item.respondent,
        respondentOther: item.respondentOther,
        respondentCpf: item.respondentCpf,
        familyIncome: item.familyIncome,
        imageAuthorization: item.imageAuthorization,
        numberOfChildren: item.numberOfChildren,
        residenceType: item.residenceType,
        residenceTypeOther: item.residenceTypeOther,
        cep: item.cep,
        street: item.street,
        number: item.number,
        neighborhood: item.neighborhood,
        referencePoint: item.referencePoint,
        motherPhone: item.motherPhone,
        fatherPhone: item.fatherPhone,
        stepParentName: item.stepParentName,
        bpc: item.bpc,
        crasRegistration: item.crasRegistration,
        municipalCard: item.municipalCard,
        ciptea: item.ciptea,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      } as FamilyOutput,
      autisticChildren: item.autisticChild?.map((child) => ({
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
        createdAt: child.createdAt,
        updatedAt: child.updatedAt,
      })) as AutisticOutput[],
    }));

    return {
      items,
      meta: familys.meta,
    };
  }
}
