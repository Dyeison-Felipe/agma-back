import { TransparencyPortalRepository } from '@/core/transparency-portal/transparency-portal.interface';
import { FindAllPaginatedTransparencyByTypeUseCase } from '@/core/transparency-portal/usecase/find-all-paginated-transparency-by-type.usecase';
import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import type { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

const mockPagination: PaginationDto = { page: 1, limit: 10 };

const mockMeta = {
  totalItems: 2,
  itemCount: 2,
  itemsPerPage: 10,
  totalPages: 1,
  currentPage: 1,
};

const mockDocuments = {
  items: [
    { id: 'doc-1', name: 'file-one.pdf', path: 'contracts/file-one.pdf' },
    { id: 'doc-2', name: 'file-two.pdf', path: 'contracts/file-two.pdf' },
  ],
  meta: mockMeta,
};

const mockTransparencyType = { id: 'type-id-123', name: 'contracts' };

const API_URL = 'https://api.example.com';

const makeSut = () => {
  const transparencyPortalRepository = {
    findAll: jest.fn().mockResolvedValue(mockDocuments),
    create: jest.fn(),
  } as unknown as jest.Mocked<TransparencyPortalRepository>;

  const transparencyTypeRepository = {
    findById: jest.fn().mockResolvedValue(mockTransparencyType),
  } as unknown as jest.Mocked<TransparencyTypeRepository>;

  const envConfigService = {
    getApiUrl: jest.fn().mockReturnValue(API_URL),
  } as unknown as jest.Mocked<EnvConfigService>;

  const sut = new FindAllPaginatedTransparencyByTypeUseCase(
    transparencyPortalRepository,
    transparencyTypeRepository,
    envConfigService,
  );

  return {
    sut,
    transparencyPortalRepository,
    transparencyTypeRepository,
    envConfigService,
  };
};

describe('FindAllPaginatedTransparencyByTypeUseCase', () => {
  describe('Transparency type validation', () => {
    it('should throw NotFoundError when transparencyTypeId is provided but type does not exist', async () => {
      const { sut, transparencyTypeRepository } = makeSut();
      transparencyTypeRepository.findById.mockResolvedValueOnce(null);

      await expect(
        sut.execute({
          transparencyTypeId: 'non-existent-id',
          pagination: mockPagination,
        }),
      ).rejects.toThrow(
        new NotFoundError('Tipo de transparência não encontrado'),
      );
    });

    it('should call findById with the provided transparencyTypeId', async () => {
      const { sut, transparencyTypeRepository } = makeSut();

      await sut.execute({
        transparencyTypeId: mockTransparencyType.id,
        pagination: mockPagination,
      });

      expect(transparencyTypeRepository.findById).toHaveBeenCalledWith(
        mockTransparencyType.id,
      );
    });

    it('should skip the type validation when transparencyTypeId is not provided', async () => {
      const { sut, transparencyTypeRepository } = makeSut();

      await sut.execute({ pagination: mockPagination });

      expect(transparencyTypeRepository.findById).not.toHaveBeenCalled();
    });

    it('should not call findAll when the transparency type is not found', async () => {
      const { sut, transparencyTypeRepository, transparencyPortalRepository } =
        makeSut();
      transparencyTypeRepository.findById.mockResolvedValueOnce(null);

      await expect(
        sut.execute({
          transparencyTypeId: 'invalid-id',
          pagination: mockPagination,
        }),
      ).rejects.toThrow();

      expect(transparencyPortalRepository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('Repository query', () => {
    it('should call findAll with the pagination and typeId filter when transparencyTypeId is provided', async () => {
      const { sut, transparencyPortalRepository } = makeSut();

      await sut.execute({
        transparencyTypeId: mockTransparencyType.id,
        pagination: mockPagination,
      });

      expect(transparencyPortalRepository.findAll).toHaveBeenCalledWith(
        mockPagination,
        { typeId: mockTransparencyType.id },
      );
    });

    it('should call findAll with undefined typeId filter when transparencyTypeId is not provided', async () => {
      const { sut, transparencyPortalRepository } = makeSut();

      await sut.execute({ pagination: mockPagination });

      expect(transparencyPortalRepository.findAll).toHaveBeenCalledWith(
        mockPagination,
        { typeId: undefined },
      );
    });
  });

  describe('Output mapping', () => {
    it('should return the items mapped with the correct fields', async () => {
      const { sut } = makeSut();

      const result = await sut.execute({ pagination: mockPagination });

      expect(result.items).toEqual([
        {
          id: 'doc-1',
          filename: 'file-one.pdf',
          path: `${API_URL}/api/v1/storage/contracts/file-one.pdf`,
        },
        {
          id: 'doc-2',
          filename: 'file-two.pdf',
          path: `${API_URL}/api/v1/storage/contracts/file-two.pdf`,
        },
      ]);
    });

    it('should build the path using the api url from envConfigService', async () => {
      const { sut, envConfigService } = makeSut();

      await sut.execute({ pagination: mockPagination });

      expect(envConfigService.getApiUrl).toHaveBeenCalled();
    });

    it('should return the pagination meta unchanged from the repository', async () => {
      const { sut } = makeSut();

      const result = await sut.execute({ pagination: mockPagination });

      expect(result.meta).toEqual(mockMeta);
    });

    it('should return an empty items array when the repository returns no documents', async () => {
      const { sut, transparencyPortalRepository } = makeSut();
      transparencyPortalRepository.findAll.mockResolvedValueOnce({
        items: [],
        meta: { ...mockMeta, totalItems: 0, itemCount: 0, totalPages: 0 },
      });

      const result = await sut.execute({ pagination: mockPagination });

      expect(result.items).toEqual([]);
    });

    it('should map the filename from the document name field', async () => {
      const { sut } = makeSut();

      const result = await sut.execute({ pagination: mockPagination });

      result.items.forEach((item, index) => {
        expect(item.filename).toBe(mockDocuments.items[index].name);
      });
    });
  });

  describe('Successful execution without filter', () => {
    it('should return a valid paginated output without transparencyTypeId', async () => {
      const { sut } = makeSut();

      const result = await sut.execute({ pagination: mockPagination });

      expect(result).toEqual({
        items: expect.any(Array),
        meta: mockMeta,
      });
    });
  });
});
