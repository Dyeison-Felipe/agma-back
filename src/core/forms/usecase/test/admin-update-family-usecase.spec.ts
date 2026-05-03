import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { FamilyRepository } from '@/core/family/family.interface';
import { AdminUpdateFamilyUseCase } from '@/core/forms/usecase/admin-update-family.usecase';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { JwtService } from '@/shared/jwt/jwt.interface';

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
  updateToken: 'some-token',
  version: 1,
  autisticChild: [
    {
      id: 'child-id-1',
      fullName: 'Criança Antiga',
      createdAt: new Date('2023-01-01'),
    },
  ],
  ...overrides,
});

const makeInput = (overrides = {}) => ({
  id: 'family-id-1',
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
  autistic_children: [
    {
      id: 'child-id-1',
      fullName: 'Filho Atualizado',
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
    },
  ],
  ...overrides,
});

describe('AdminUpdateFamilyUseCase', () => {
  let useCase: AdminUpdateFamilyUseCase;
  let familyRepository: jest.Mocked<FamilyRepository>;
  let autistChildRepository: jest.Mocked<AutisticChildRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    familyRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    autistChildRepository = {
      save: jest.fn(),
    } as any;

    jwtService = {} as any;

    useCase = new AdminUpdateFamilyUseCase(
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

    it('não deve chamar save em nenhum repositório', async () => {
      familyRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(makeInput())).rejects.toThrow(NotFoundError);

      expect(familyRepository.save).not.toHaveBeenCalled();
      expect(autistChildRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('quando a família é encontrada', () => {
    let family: ReturnType<typeof makeFamily>;
    let input: ReturnType<typeof makeInput>;
    let savedFamily: any;
    let savedChild: any;

    beforeEach(() => {
      family = makeFamily();
      input = makeInput();

      savedFamily = { ...family, email: input.email };
      savedChild = {
        id: 'child-id-1',
        fullName: input.autistic_children[0].fullName,
      };

      familyRepository.findById.mockResolvedValue(family as any);
      familyRepository.save.mockResolvedValue(savedFamily as any);
      autistChildRepository.save.mockResolvedValue(savedChild as any);
    });

    it('deve retornar family e autisticChildren no output', async () => {
      const result = await useCase.execute(input);

      expect(result).toEqual({
        family: savedFamily,
        autisticChildren: [savedChild],
      });
    });

    it('deve zerar o updateToken da família antes de salvar', async () => {
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.updateToken).toBeNull();
    });

    it('deve gerar um novo id (uuid) para a família ao salvar', async () => {
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.id).toBeDefined();
      expect(savedPayload.id).not.toBe('family-id-1');
    });

    it('deve incrementar a versão da família', async () => {
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.version).toBe(family.version + 1);
    });

    it('deve atualizar os dados da família com os valores do input', async () => {
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
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.respondentCpf).toMatch(/^\d+$/);
    });

    it('deve limpar o CEP antes de salvar quando informado', async () => {
      const inputComCep = makeInput({ cep: '85.010-000' });
      familyRepository.findById.mockResolvedValue(family as any);

      await useCase.execute(inputComCep);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.cep).toMatch(/^\d+$/);
    });

    it('deve manter cep como undefined quando não informado', async () => {
      const inputSemCep = makeInput({ cep: undefined });
      familyRepository.findById.mockResolvedValue(family as any);

      await useCase.execute(inputSemCep);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.cep).toBeUndefined();
    });

    it('deve atualizar os dados do filho existente mantendo createdAt original', async () => {
      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.fullName).toBe(
        input.autistic_children[0].fullName,
      );
      expect(savedChildPayload.createdAt).toEqual(
        family.autisticChild[0].createdAt,
      );
    });

    it('deve gerar novo uuid para cada filho ao salvar', async () => {
      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.id).toBeDefined();
      expect(savedChildPayload.id).not.toBe('child-id-1');
    });

    it('deve associar o filho à família correta via family.id', async () => {
      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.family).toEqual({ id: input.id });
    });

    it('deve salvar todos os filhos enviados no input', async () => {
      const multiChildInput = makeInput({
        autistic_children: [
          { ...makeInput().autistic_children[0], id: 'child-id-1' },
          {
            ...makeInput().autistic_children[0],
            id: 'child-id-2',
            fullName: 'Segundo Filho',
          },
        ],
      });

      autistChildRepository.save
        .mockResolvedValueOnce({
          id: 'new-1',
          fullName: 'Filho Atualizado',
        } as any)
        .mockResolvedValueOnce({
          id: 'new-2',
          fullName: 'Segundo Filho',
        } as any);

      const result = await useCase.execute(multiChildInput);

      expect(autistChildRepository.save).toHaveBeenCalledTimes(2);
      expect(result.autisticChildren).toHaveLength(2);
    });
  });

  describe('campos opcionais', () => {
    it('deve aceitar input sem fatherPhone, stepParentName, referencePoint e respondentOther', async () => {
      const family = makeFamily();
      familyRepository.findById.mockResolvedValue(family as any);
      familyRepository.save.mockResolvedValue(family as any);
      autistChildRepository.save.mockResolvedValue({} as any);

      const input = makeInput({
        fatherPhone: undefined,
        stepParentName: undefined,
        referencePoint: undefined,
        respondentOther: undefined,
      });

      await expect(useCase.execute(input)).resolves.not.toThrow();
    });

    it('deve salvar comorbiditiesOther quando informado no filho', async () => {
      const family = makeFamily();
      familyRepository.findById.mockResolvedValue(family as any);
      familyRepository.save.mockResolvedValue(family as any);
      autistChildRepository.save.mockResolvedValue({} as any);

      const input = makeInput({
        autistic_children: [
          {
            ...makeInput().autistic_children[0],
            comorbiditiesOther: 'TDAH',
          },
        ],
      });

      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.comorbiditiesOther).toBe('TDAH');
    });
  });

  describe('quando version da família é nula ou undefined', () => {
    it('deve tratar version nula como 1 e salvar version 2', async () => {
      const family = makeFamily({ version: null });
      familyRepository.findById.mockResolvedValue(family as any);
      familyRepository.save.mockResolvedValue(family as any);
      autistChildRepository.save.mockResolvedValue({} as any);

      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.version).toBe(2);
    });
  });
});
