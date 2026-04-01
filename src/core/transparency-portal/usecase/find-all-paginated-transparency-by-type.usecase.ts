import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import type { TransparencyPortalRepository } from '../transparency-portal.interface';
import { Pagination } from '@/shared/presenters/pagination/pagination.presenter';
import { TransparencyPortalOutput } from '@/shared/output/trasnparency-portal/transparency-portal.output';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { TransparencyPortalPaginatedOutput } from '@/shared/output/trasnparency-portal/transparency-portal-paginated.output';

type Input = { transparencyTypeId: string; pagination: PaginationDto };

type Output = Pagination<TransparencyPortalPaginatedOutput>;

export class FindAllPaginatedTransparencyByTypeUseCase implements UseCase<
  Input,
  Output
> {
  constructor(
    @Inject(PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY)
    private readonly transparencyPortalRepository: TransparencyPortalRepository,
    @Inject(PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY)
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const transparencyType = await this.transparencyTypeRepository.findById(
      input.transparencyTypeId,
    );

    if (!transparencyType) {
      throw new NotFoundError(`Tipo de transparência não encontrado`);
    }

    const documents =
      await this.transparencyPortalRepository.findAllByType(
        transparencyType.id,
        input.pagination,
      );

    const output = documents.items.map((transparency) => ({
      id: transparency.id,
      path: transparency.path,
      filename: transparency.name,
    }));

    return {
      items: output,
      meta: documents.meta,
    };
  }
}
