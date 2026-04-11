import { TransparencyPortalRepository } from '@/core/transparency-portal/transparency-portal.interface';
import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { FileDto } from '@/shared/dto/file.dto';
import type { SupabaseService } from '@/shared/supabase/supabase.interface';
import { CreateTransparencyPortalUseCase } from '../../create-transparency-portal.usecase';

const mockTransparencyType = {
  id: 'type-id-123',
  name: 'contracts',
};

const mockFileDto: FileDto = {
  buffer: Buffer.from('pdf-content'),
  filename: 'document.pdf',
  extension: '.pdf',
};

const mockSavedDocument = {
  id: 'doc-id-123',
  name: mockFileDto.filename,
  path: 'contracts/uuid-123.pdf',
  transparencyType: mockTransparencyType,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const FIXED_UUID = 'uuid-123-fixed';

const makeSut = () => {
  const transparencyRepository = {
    create: jest.fn().mockResolvedValue(mockSavedDocument),
  } as unknown as jest.Mocked<TransparencyPortalRepository>;

  const supabaseService = {
    uploadPdf: jest.fn().mockResolvedValue('contracts/uuid-123.pdf'),
  } as unknown as jest.Mocked<SupabaseService>;

  const transparencyTypeRepository = {
    findById: jest.fn().mockResolvedValue(mockTransparencyType),
  } as unknown as jest.Mocked<TransparencyTypeRepository>;

  const sut = new CreateTransparencyPortalUseCase(
    transparencyRepository,
    supabaseService,
    transparencyTypeRepository,
  );

  return {
    sut,
    transparencyRepository,
    supabaseService,
    transparencyTypeRepository,
  };
};

jest.mock('@/shared/decorators/transactional.decorator');
describe('CreateTransparencyPortalUseCase', () => {
  const defaultInput = {
    transparencyType: { id: mockTransparencyType.id },
    fileBuffer: mockFileDto,
  };

  beforeEach(() => {
    jest
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue(
        FIXED_UUID as `${string}-${string}-${string}-${string}-${string}`,
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Transparency type validation', () => {
    it('should throw an error when transparency type is not found', async () => {
      const { sut, transparencyTypeRepository } = makeSut();
      transparencyTypeRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.execute(defaultInput)).rejects.toThrow(
        'Tipo não encontrado',
      );
    });

    it('should call findById with the provided transparency type id', async () => {
      const { sut, transparencyTypeRepository } = makeSut();

      await sut.execute(defaultInput);

      expect(transparencyTypeRepository.findById).toHaveBeenCalledWith(
        defaultInput.transparencyType.id,
      );
    });

    it('should not call uploadPdf when transparency type is not found', async () => {
      const { sut, transparencyTypeRepository, supabaseService } = makeSut();
      transparencyTypeRepository.findById.mockResolvedValueOnce(null);

      await expect(sut.execute(defaultInput)).rejects.toThrow();

      expect(supabaseService.uploadPdf).not.toHaveBeenCalled();
    });
  });

  describe('PDF upload', () => {
    it('should throw an error when uploadPdf returns a falsy value', async () => {
      const { sut, supabaseService } = makeSut();
      supabaseService.uploadPdf.mockResolvedValueOnce(null as any);

      await expect(sut.execute(defaultInput)).rejects.toThrow(
        'Erro ao salvar o pdf',
      );
    });

    it('should call uploadPdf with the file buffer, generated filename and transparency type name', async () => {
      const { sut, supabaseService } = makeSut();

      await sut.execute(defaultInput);

      const expectedFileName = `${FIXED_UUID}${mockFileDto.extension}`;

      expect(supabaseService.uploadPdf).toHaveBeenCalledWith(
        mockFileDto.buffer,
        expectedFileName,
        mockTransparencyType.name,
      );
    });

    it('should not call repository create when uploadPdf fails', async () => {
      const { sut, supabaseService, transparencyRepository } = makeSut();
      supabaseService.uploadPdf.mockResolvedValueOnce(null as any);

      await expect(sut.execute(defaultInput)).rejects.toThrow();

      expect(transparencyRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Document creation', () => {
    it('should call repository create with the correct payload', async () => {
      const { sut, transparencyRepository } = makeSut();

      await sut.execute(defaultInput);

      expect(transparencyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: FIXED_UUID,
          name: mockFileDto.filename,
          path: 'contracts/uuid-123.pdf',
          transparencyType: mockTransparencyType,
        }),
      );
    });

    it('should include createdAt and updatedAt as Date instances in the create payload', async () => {
      const { sut, transparencyRepository } = makeSut();

      await sut.execute(defaultInput);

      const payload = transparencyRepository.create.mock.calls[0][0];

      expect(payload.createdAt).toBeInstanceOf(Date);
      expect(payload.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Successful output', () => {
    it('should return the saved document in the correct output format', async () => {
      const { sut } = makeSut();

      const output = await sut.execute(defaultInput);

      expect(output).toEqual({
        id: mockSavedDocument.id,
        filename: mockSavedDocument.name,
        path: mockSavedDocument.path,
        transparencyType: mockSavedDocument.transparencyType,
      });
    });
  });

  describe('File naming', () => {
    it('should generate the filename using a UUID followed by the file extension', async () => {
      const { sut, supabaseService } = makeSut();

      await sut.execute(defaultInput);

      const [, calledFileName] = supabaseService.uploadPdf.mock.calls[0];

      expect(calledFileName).toBe(`${FIXED_UUID}${mockFileDto.extension}`);
    });

    it('should use crypto.randomUUID to generate both the document id and the file name', async () => {
      const { sut } = makeSut();

      await sut.execute(defaultInput);

      expect(crypto.randomUUID).toHaveBeenCalledTimes(2);
    });
  });
});
