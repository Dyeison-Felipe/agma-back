import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { FamilyRepository } from '@/core/family/family.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { UpdateFamilyUseCase } from '../update-family.usecase';

jest.mock('@/shared/utils/validate-cpf', () => ({
  isValidCPF: jest.fn((cpf: string) => cpf.replace(/\D/g, '')),
}));

jest.mock('@/shared/utils/clean-cep', () => ({
  cleanCEP: jest.fn((cep: string) => cep.replace(/\D/g, '')),
}));

jest.mock('@/shared/decorators/transactional.decorator', () => ({
  Transactional:
    () => (_target: any, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

const VALID_TOKEN = 'valid-jwt-token';

const makeChild = (overrides = {}) => ({
  id: 'child-id-1',
  fullName: 'Filho Teste',
  birthDate: '2015-05-10',
  gender: 'Masculino',
  motherName: 'Mae Teste',
  fatherName: 'Pai Teste',
  autismCondition: 'Leve',
  supportLevel: '1',
  comorbidities: 'Nenhuma',
  multiprofessionalSupport: true,
  usesMedication: false,
  schoolGrade: '3',
  schoolName: 'Escola Teste',
  createdAt: new Date('2023-01-01'),
  ...overrides,
});

const makeFamily = (overrides = {}) => ({
  id: 'family-id-1',
  email: 'old@email.com',
  respondent: 'Mae',
  respondentCpf: '00000000000',
  familyIncome: '1000',
  imageAuthorization: false,
  numberOfChildren: '1',
  residenceType: 'Casa',
  street: 'Rua Antiga',
  number: '1',
  neighborhood: 'Bairro Velho',
  motherPhone: '999999999',
  bpc: 'Nao',
  crasRegistration: false,
  municipalCard: false,
  ciptea: false,
  updateToken: VALID_TOKEN,
  version: 1,
  autisticChild: [makeChild()],
  ...overrides,
});

const makeInput = (overrides = {}) => ({
  id: 'family-id-1',
  token: VALID_TOKEN,
  email: 'new@email.com',
  respondent: 'Pai',
  respondentCpf: '123.456.789-09',
  familyIncome: '2000',
  imageAuthorization: true,
  numberOfChildren: '2',
  residenceType: 'Apartamento',
  street: 'Rua Nova',
  number: '42',
  neighborhood: 'Bairro Novo',
  motherPhone: '988888888',
  bpc: 'Sim',
  crasRegistration: true,
  municipalCard: true,
  ciptea: false,
  autistic_children: [makeChild()],
  ...overrides,
});

describe('UpdateFamilyUseCase', () => {
  let useCase: UpdateFamilyUseCase;
  let familyRepository: jest.Mocked<FamilyRepository>;
  let autistChildRepository: jest.Mocked<AutisticChildRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    familyRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    autistChildRepository = {
      update: jest.fn(),
    } as any;

    jwtService = {
      verifyJwt: jest.fn(),
    } as any;

    useCase = new UpdateFamilyUseCase(
      autistChildRepository,
      familyRepository,
      jwtService,
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('quando a família não é encontrada', () => {
    it('deve lançar NotFoundError', async () => {
      familyRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(makeInput())).rejects.toThrow(NotFoundError);
      await expect(useCase.execute(makeInput())).rejects.toThrow(
        'Família não encontrada',
      );
    });

    it('não deve chamar verifyJwt nem save', async () => {
      familyRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(makeInput())).rejects.toThrow(NotFoundError);

      expect(jwtService.verifyJwt).not.toHaveBeenCalled();
      expect(familyRepository.save).not.toHaveBeenCalled();
      expect(autistChildRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('quando o JWT é inválido', () => {
    it('deve lançar UnauthorizedError quando verifyJwt retorna falsy', async () => {
      familyRepository.findById.mockResolvedValue(makeFamily() as any);
      jwtService.verifyJwt.mockResolvedValue(null as any);

      await expect(useCase.execute(makeInput())).rejects.toThrow(
        UnauthorizedError,
      );
      await expect(useCase.execute(makeInput())).rejects.toThrow(
        'Não autorizado',
      );
    });

    it('não deve chamar save quando JWT é inválido', async () => {
      familyRepository.findById.mockResolvedValue(makeFamily() as any);
      jwtService.verifyJwt.mockResolvedValue(null as any);

      await expect(useCase.execute(makeInput())).rejects.toThrow(
        UnauthorizedError,
      );

      expect(familyRepository.save).not.toHaveBeenCalled();
      expect(autistChildRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('quando o token não corresponde ao updateToken da família', () => {
    it('deve lançar UnauthorizedError', async () => {
      familyRepository.findById.mockResolvedValue(makeFamily() as any);
      jwtService.verifyJwt.mockResolvedValue({ sub: 'user' } as any);

      await expect(
        useCase.execute(makeInput({ token: 'different-token' })),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('não deve chamar save quando tokens não batem', async () => {
      familyRepository.findById.mockResolvedValue(makeFamily() as any);
      jwtService.verifyJwt.mockResolvedValue({ sub: 'user' } as any);

      await expect(
        useCase.execute(makeInput({ token: 'different-token' })),
      ).rejects.toThrow(UnauthorizedError);

      expect(familyRepository.save).not.toHaveBeenCalled();
      expect(autistChildRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('quando família é encontrada e token é válido', () => {
    let family: ReturnType<typeof makeFamily>;
    let savedFamily: any;
    let savedChild: any;

    beforeEach(() => {
      family = makeFamily();
      savedFamily = { ...family, email: 'new@email.com' };
      savedChild = { id: 'new-child-uuid', fullName: 'Filho Teste' };

      familyRepository.findById.mockResolvedValue(family as any);
      jwtService.verifyJwt.mockResolvedValue({ sub: 'user' } as any);
      familyRepository.save.mockResolvedValue(savedFamily as any);
      autistChildRepository.update.mockResolvedValue(savedChild as any);
    });

    it('deve retornar family e autisticChildren no output', async () => {
      const result = await useCase.execute(makeInput());

      expect(result).toEqual({
        family: savedFamily,
        autisticChildren: [savedChild],
      });
    });

    it('deve zerar o updateToken da família antes de salvar', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.updateToken).toBeNull();
    });

    it('deve gerar novo uuid para a família ao salvar', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.id).toBeDefined();
      expect(savedPayload.id).not.toBe('family-id-1');
    });

    it('deve incrementar a versão da família', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.version).toBe(family.version + 1);
    });

    it('deve atualizar os dados da família com os valores do input', async () => {
      const input = makeInput();
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.email).toBe(input.email);
      expect(savedPayload.respondent).toBe(input.respondent);
      expect(savedPayload.familyIncome).toBe(input.familyIncome);
      expect(savedPayload.street).toBe(input.street);
      expect(savedPayload.number).toBe(input.number);
      expect(savedPayload.neighborhood).toBe(input.neighborhood);
      expect(savedPayload.motherPhone).toBe(input.motherPhone);
      expect(savedPayload.bpc).toBe(input.bpc);
      expect(savedPayload.crasRegistration).toBe(input.crasRegistration);
      expect(savedPayload.municipalCard).toBe(input.municipalCard);
      expect(savedPayload.ciptea).toBe(input.ciptea);
      expect(savedPayload.imageAuthorization).toBe(input.imageAuthorization);
    });

    it('deve limpar o CPF antes de salvar (apenas dígitos)', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.respondentCpf).toMatch(/^\d+$/);
    });

    it('deve limpar o CEP antes de salvar quando informado', async () => {
      await useCase.execute(makeInput({ cep: '85.010-000' }));

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.cep).toMatch(/^\d+$/);
    });

    it('deve manter cep como undefined quando não informado', async () => {
      await useCase.execute(makeInput({ cep: undefined }));

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.cep).toBeUndefined();
    });

    it('deve preservar createdAt original do filho existente', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.update.mock
        .calls[0][0] as any;
      expect(savedChildPayload.createdAt).toEqual(
        family.autisticChild[0].createdAt,
      );
    });

    it('deve gerar novo uuid para cada filho ao atualizar', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.update.mock
        .calls[0][0] as any;
      expect(savedChildPayload.id).toBeDefined();
      expect(savedChildPayload.id).not.toBe('child-id-1');
    });

    it('deve associar o filho à família pelo input.id', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.update.mock
        .calls[0][0] as any;
      expect(savedChildPayload.family).toEqual({ id: 'family-id-1' });
    });

    it('deve chamar update para todos os filhos do input', async () => {
      const input = makeInput({
        autistic_children: [
          makeChild({ id: 'child-id-1', fullName: 'Filho 1' }),
          makeChild({ id: 'child-id-2', fullName: 'Filho 2' }),
        ],
      });

      autistChildRepository.update
        .mockResolvedValueOnce({ id: 'uuid-1' } as any)
        .mockResolvedValueOnce({ id: 'uuid-2' } as any);

      const result = await useCase.execute(input);

      expect(autistChildRepository.update).toHaveBeenCalledTimes(2);
      expect(result.autisticChildren).toHaveLength(2);
    });

    it('deve usar dados do existingChild quando o id do filho bate', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.update.mock
        .calls[0][0] as any;
      expect(savedChildPayload.createdAt).toEqual(
        family.autisticChild[0].createdAt,
      );
    });

    it('deve tratar filho sem correspondência na família (novo filho)', async () => {
      const input = makeInput({
        autistic_children: [makeChild({ id: 'child-id-novo' })],
      });

      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.update.mock
        .calls[0][0] as any;
      expect(savedChildPayload.fullName).toBe('Filho Teste');
    });
  });

  describe('quando version da família é nula', () => {
    it('deve tratar version nula como 1 e salvar version 2', async () => {
      familyRepository.findById.mockResolvedValue(
        makeFamily({ version: null }) as any,
      );
      jwtService.verifyJwt.mockResolvedValue({ sub: 'user' } as any);
      familyRepository.save.mockResolvedValue({} as any);
      autistChildRepository.update.mockResolvedValue({} as any);

      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.version).toBe(2);
    });
  });

  describe('campos opcionais', () => {
    beforeEach(() => {
      familyRepository.findById.mockResolvedValue(makeFamily() as any);
      jwtService.verifyJwt.mockResolvedValue({ sub: 'user' } as any);
      familyRepository.save.mockResolvedValue({} as any);
      autistChildRepository.update.mockResolvedValue({} as any);
    });

    it('deve aceitar input sem fatherPhone, stepParentName, referencePoint e respondentOther', async () => {
      const input = makeInput({
        fatherPhone: undefined,
        stepParentName: undefined,
        referencePoint: undefined,
        respondentOther: undefined,
      });

      await expect(useCase.execute(input)).resolves.not.toThrow();
    });

    it('deve salvar comorbiditiesOther no filho quando informado', async () => {
      const input = makeInput({
        autistic_children: [makeChild({ comorbiditiesOther: 'TDAH' })],
      });

      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.update.mock
        .calls[0][0] as any;
      expect(savedChildPayload.comorbiditiesOther).toBe('TDAH');
    });
  });
});
