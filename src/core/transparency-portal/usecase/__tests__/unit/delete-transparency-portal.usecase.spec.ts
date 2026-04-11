import { TransparencyPortalRepository } from '@/core/transparency-portal/transparency-portal.interface';
import { DeleteDocumentTransparencyPortalUseCase } from '@/core/transparency-portal/usecase/delete-transparency-portal.usecase';
import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import type { SupabaseService } from '@/shared/supabase/supabase.interface';

const mockTransparencyType = { id: 'type-id-123', name: 'contracts' };

const mockDocument = {
  id: 'doc-id-456',
  name: 'file.pdf',
  path: 'contracts/file.pdf',
  transparencyType: mockTransparencyType,
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
    findById: jest.fn().mockResolvedValue(mockTransparencyType),
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

jest.mock('@/shared/decorators/transactional.decorator');
describe('DeleteDocumentTransparencyPortalUseCase', () => {
  const defaultInput = {
    typeId: mockTransparencyType.id,
    documentId: mockDocument.id,
  };

  describe('Transparency type validation', () => {
    it('should throw NotFoundError when the transparency type does not exist', async () => {
      const { sut, transparencyTypeRepository } = makeSut();
      transparencyTypeRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.execute(defaultInput)).rejects.toThrow(
        new NotFoundError('Tipo de transparência não encontrado'),
      );
    });

    it('should call findById with the provided typeId', async () => {
      const { sut, transparencyTypeRepository } = makeSut();

      await sut.execute(defaultInput);

      expect(transparencyTypeRepository.findById).toHaveBeenCalledWith(
        defaultInput.typeId,
      );
    });

    it('should not look up the document when the transparency type is not found', async () => {
      const { sut, transparencyTypeRepository, transparencyPortalRepository } =
        makeSut();
      transparencyTypeRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.execute(defaultInput)).rejects.toThrow();

      expect(
        transparencyPortalRepository.findDocumentByTypeIdAndDocumentId,
      ).not.toHaveBeenCalled();
    });
  });

  describe('Document validation', () => {
    it('should throw NotFoundError when the document does not exist for the given type', async () => {
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

    it('should call findDocumentByTypeIdAndDocumentId with the type id and document id', async () => {
      const { sut, transparencyPortalRepository } = makeSut();

      await sut.execute(defaultInput);

      expect(
        transparencyPortalRepository.findDocumentByTypeIdAndDocumentId,
      ).toHaveBeenCalledWith(mockTransparencyType.id, mockDocument.id);
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

  describe('Execution order', () => {
    it('should use the type id from the found transparency type, not directly from the input', async () => {
      const { sut, transparencyTypeRepository, transparencyPortalRepository } =
        makeSut();
      const resolvedType = { ...mockTransparencyType, id: 'resolved-type-id' };
      transparencyTypeRepository.findById.mockResolvedValueOnce(
        resolvedType as any,
      );

      await sut.execute(defaultInput);

      expect(
        transparencyPortalRepository.findDocumentByTypeIdAndDocumentId,
      ).toHaveBeenCalledWith('resolved-type-id', mockDocument.id);
    });
  });
});
