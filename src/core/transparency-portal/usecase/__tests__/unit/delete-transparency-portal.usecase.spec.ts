import { TransparencyPortalRepository } from '@/core/transparency-portal/transparency-portal.interface';
import { DeleteDocumentTransparencyPortalUseCase } from '@/core/transparency-portal/usecase/delete-transparency-portal.usecase';
import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import type { SupabaseService } from '@/shared/supabase/supabase.interface';

jest.mock('@/shared/decorators/transactional.decorator', () => ({
  Transactional:
    () => (_target: any, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

const mockDocument = {
  id: 'doc-id-456',
  name: 'file.pdf',
  path: 'contracts/file.pdf',
};

const makeSut = () => {
  const transparencyPortalRepository = {
    findDocumentByTypeIdAndDocumentId: jest
      .fn()
      .mockResolvedValue(mockDocument),
    delete: jest.fn().mockResolvedValue(undefined),
    create: jest.fn(),
    findAll: jest.fn(),
  } as unknown as jest.Mocked<TransparencyPortalRepository>;

  const transparencyTypeRepository = {
    findById: jest.fn(),
  } as unknown as jest.Mocked<TransparencyTypeRepository>;

  const supabaseService = {
    deleteFileByUrl: jest.fn().mockResolvedValue(undefined),
    uploadPdf: jest.fn(),
  } as unknown as jest.Mocked<SupabaseService>;

  const sut = new DeleteDocumentTransparencyPortalUseCase(
    transparencyPortalRepository,
    transparencyTypeRepository,
    supabaseService,
  );

  return {
    sut,
    transparencyPortalRepository,
    transparencyTypeRepository,
    supabaseService,
  };
};

describe('DeleteDocumentTransparencyPortalUseCase', () => {
  const defaultInput = { documentId: mockDocument.id };

  describe('Document validation', () => {
    it('should throw NotFoundError when the document does not exist', async () => {
      const { sut, transparencyPortalRepository } = makeSut();
      transparencyPortalRepository.findDocumentByTypeIdAndDocumentId.mockResolvedValueOnce(
        null,
      );

      await expect(sut.execute(defaultInput)).rejects.toThrow(
        new NotFoundError(
          'Documento não encontrado para esse tipo de transparência',
        ),
      );
    });

    it('should call findDocumentByTypeIdAndDocumentId with the document id', async () => {
      const { sut, transparencyPortalRepository } = makeSut();

      await sut.execute(defaultInput);

      expect(
        transparencyPortalRepository.findDocumentByTypeIdAndDocumentId,
      ).toHaveBeenCalledWith(mockDocument.id);
    });

    it('should not call deleteFileByUrl when the document is not found', async () => {
      const { sut, transparencyPortalRepository, supabaseService } = makeSut();
      transparencyPortalRepository.findDocumentByTypeIdAndDocumentId.mockResolvedValueOnce(
        null,
      );

      await expect(sut.execute(defaultInput)).rejects.toThrow();

      expect(supabaseService.deleteFileByUrl).not.toHaveBeenCalled();
    });

    it('should not call repository delete when the document is not found', async () => {
      const { sut, transparencyPortalRepository } = makeSut();
      transparencyPortalRepository.findDocumentByTypeIdAndDocumentId.mockResolvedValueOnce(
        null,
      );

      await expect(sut.execute(defaultInput)).rejects.toThrow();

      expect(transparencyPortalRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('Successful deletion', () => {
    it('should call deleteFileByUrl with the document path', async () => {
      const { sut, supabaseService } = makeSut();

      await sut.execute(defaultInput);

      expect(supabaseService.deleteFileByUrl).toHaveBeenCalledWith(
        mockDocument.path,
      );
    });

    it('should call repository delete with the document id', async () => {
      const { sut, transparencyPortalRepository } = makeSut();

      await sut.execute(defaultInput);

      expect(transparencyPortalRepository.delete).toHaveBeenCalledWith(
        mockDocument.id,
      );
    });

    it('should call deleteFileByUrl before repository delete', async () => {
      const { sut, supabaseService, transparencyPortalRepository } = makeSut();
      const callOrder: string[] = [];

      supabaseService.deleteFileByUrl.mockImplementationOnce(async () => {
        callOrder.push('deleteFileByUrl');
      });

      transparencyPortalRepository.delete.mockImplementationOnce(async () => {
        callOrder.push('delete');
      });

      await sut.execute(defaultInput);

      expect(callOrder).toEqual(['deleteFileByUrl', 'delete']);
    });

    it('should return void on success', async () => {
      const { sut } = makeSut();

      const result = await sut.execute(defaultInput);

      expect(result).toBeUndefined();
    });
  });
});
