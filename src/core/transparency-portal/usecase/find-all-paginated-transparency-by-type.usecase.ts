import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { TransparencyPortalPaginatedOutput } from '@/shared/output/trasnparency-portal/transparency-portal-paginated.output';
import { Pagination } from '@/shared/presenters/pagination/pagination.presenter';
import { UseCase } from '@/shared/usecase/usecase';
import type { TransparencyPortalRepository } from '../transparency-portal.interface';

type Input = { transparencyTypeId?: string; pagination: PaginationDto };

type Output = Pagination<TransparencyPortalPaginatedOutput>;

export class FindAllPaginatedTransparencyByTypeUseCase implements UseCase<
  Input,
  Output
> {
  constructor(
    private readonly transparencyPortalRepository: TransparencyPortalRepository,
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async execute(input: Input): Promise<Output> {
    if (input.transparencyTypeId) {
      const transparencyType = await this.transparencyTypeRepository.findById(
        input.transparencyTypeId,
      );

      if (!transparencyType) {
        throw new NotFoundError(`Tipo de transparência não encontrado`);
      }
    }

    const documents = await this.transparencyPortalRepository.findAll(
      input.pagination,
      { typeId: input.transparencyTypeId },
    );

    const output = documents.items.map((transparency) => ({
      id: transparency.id,
      path: `${this.envConfigService.getApiUrl()}/api/v1/storage/${transparency.path}`,
      filename: transparency.name,
    }));

    return {
      items: output,
      meta: documents.meta,
    };
  }
}
