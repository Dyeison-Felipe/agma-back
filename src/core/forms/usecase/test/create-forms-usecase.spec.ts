import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { FamilyRepository } from '@/core/family/family.interface';
import { CreateFormUseCase } from '@/core/forms/usecase/create-forms.usecase';
import { ConflictError } from '@/shared/errors/conflict-error';

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

const makeChild = (overrides = {}) => ({
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
  ...overrides,
});

const makeInput = (overrides = {}) => ({
  email: 'familia@email.com',
  respondent: 'Mae',
  respondentCpf: '123.456.789-09',
  familyIncome: '2000',
  imageAuthorization: true,
  numberOfChildren: '1',
  residenceType: 'Casa',
  street: 'Rua das Flores',
  number: '10',
  neighborhood: 'Centro',
  motherPhone: '988888888',
  bpc: 'Nao',
  crasRegistration: false,
  municipalCard: false,
  ciptea: false,
  autistic_children: [makeChild()],
  ...overrides,
});

describe('CreateFormUseCase', () => {
  let useCase: CreateFormUseCase;
  let familyRepository: jest.Mocked<FamilyRepository>;
  let autistChildRepository: jest.Mocked<AutisticChildRepository>;

  beforeEach(() => {
    familyRepository = {
      findByCpf: jest.fn(),
      save: jest.fn(),
    } as any;

    autistChildRepository = {
      save: jest.fn(),
    } as any;

    useCase = new CreateFormUseCase(autistChildRepository, familyRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('quando já existe família com o CPF informado', () => {
    it('deve lançar ConflictError', async () => {
      familyRepository.findByCpf.mockResolvedValue({ id: 'existing' } as any);

      await expect(useCase.execute(makeInput())).rejects.toThrow(ConflictError);
      await expect(useCase.execute(makeInput())).rejects.toThrow(
        'Essa família já está cadastrada',
      );
    });

    it('não deve chamar save em nenhum repositório', async () => {
      familyRepository.findByCpf.mockResolvedValue({ id: 'existing' } as any);

      await expect(useCase.execute(makeInput())).rejects.toThrow(ConflictError);

      expect(familyRepository.save).not.toHaveBeenCalled();
      expect(autistChildRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('quando a família não existe ainda', () => {
    let savedFamily: any;
    let savedChild: any;

    beforeEach(() => {
      savedFamily = { id: 'new-family-uuid', email: 'familia@email.com' };
      savedChild = { id: 'new-child-uuid', fullName: 'Filho Teste' };

      familyRepository.findByCpf.mockResolvedValue(null);
      familyRepository.save.mockResolvedValue(savedFamily);
      autistChildRepository.save.mockResolvedValue(savedChild);
    });

    it('deve retornar family e autisticChildren no output', async () => {
      const result = await useCase.execute(makeInput());

      expect(result).toEqual({
        family: savedFamily,
        autisticChildren: [savedChild],
      });
    });

    it('deve salvar a família com os dados do input', async () => {
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

    it('deve gerar um uuid para a família', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.id).toBeDefined();
    });

    it('deve limpar o CPF antes de salvar (apenas dígitos)', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.respondentCpf).toMatch(/^\d+$/);
    });

    it('deve limpar o CEP antes de salvar quando informado', async () => {
      const input = makeInput({ cep: '85.010-000' });
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.cep).toMatch(/^\d+$/);
    });

    it('deve manter cep como undefined quando não informado', async () => {
      const input = makeInput({ cep: undefined });
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.cep).toBeUndefined();
    });

    it('deve definir createdAt e updatedAt na família', async () => {
      await useCase.execute(makeInput());

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.createdAt).toBeInstanceOf(Date);
      expect(savedPayload.updatedAt).toBeInstanceOf(Date);
    });

    it('deve salvar o filho com os dados corretos', async () => {
      const input = makeInput();
      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      const child = input.autistic_children[0];

      expect(savedChildPayload.fullName).toBe(child.fullName);
      expect(savedChildPayload.birthDate).toBe(child.birthDate);
      expect(savedChildPayload.gender).toBe(child.gender);
      expect(savedChildPayload.motherName).toBe(child.motherName);
      expect(savedChildPayload.fatherName).toBe(child.fatherName);
      expect(savedChildPayload.autismCondition).toBe(child.autismCondition);
      expect(savedChildPayload.supportLevel).toBe(child.supportLevel);
      expect(savedChildPayload.comorbidities).toBe(child.comorbidities);
      expect(savedChildPayload.multiprofessionalSupport).toBe(
        child.multiprofessionalSupport,
      );
      expect(savedChildPayload.usesMedication).toBe(child.usesMedication);
      expect(savedChildPayload.schoolGrade).toBe(child.schoolGrade);
      expect(savedChildPayload.schoolName).toBe(child.schoolName);
    });

    it('deve gerar um uuid para o filho', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.id).toBeDefined();
    });

    it('deve associar o filho à família salva', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.family).toEqual(savedFamily);
    });

    it('deve definir createdAt e updatedAt no filho', async () => {
      await useCase.execute(makeInput());

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.createdAt).toBeInstanceOf(Date);
      expect(savedChildPayload.updatedAt).toBeInstanceOf(Date);
    });

    it('deve salvar todos os filhos quando houver múltiplos', async () => {
      const input = makeInput({
        autistic_children: [
          makeChild({ fullName: 'Filho 1' }),
          makeChild({ fullName: 'Filho 2' }),
          makeChild({ fullName: 'Filho 3' }),
        ],
      });

      autistChildRepository.save
        .mockResolvedValueOnce({ id: 'uuid-1', fullName: 'Filho 1' } as any)
        .mockResolvedValueOnce({ id: 'uuid-2', fullName: 'Filho 2' } as any)
        .mockResolvedValueOnce({ id: 'uuid-3', fullName: 'Filho 3' } as any);

      const result = await useCase.execute(input);

      expect(autistChildRepository.save).toHaveBeenCalledTimes(3);
      expect(result.autisticChildren).toHaveLength(3);
    });
  });

  describe('campos opcionais', () => {
    beforeEach(() => {
      familyRepository.findByCpf.mockResolvedValue(null);
      familyRepository.save.mockResolvedValue({ id: 'fam-uuid' } as any);
      autistChildRepository.save.mockResolvedValue({ id: 'child-uuid' } as any);
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

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.comorbiditiesOther).toBe('TDAH');
    });

    it('deve salvar medicationNames no filho quando informado', async () => {
      const input = makeInput({
        autistic_children: [
          makeChild({ usesMedication: true, medicationNames: 'Ritalina' }),
        ],
      });

      await useCase.execute(input);

      const savedChildPayload = autistChildRepository.save.mock
        .calls[0][0] as any;
      expect(savedChildPayload.medicationNames).toBe('Ritalina');
    });

    it('deve salvar residenceTypeOther quando informado', async () => {
      const input = makeInput({ residenceTypeOther: 'Outro tipo' });
      await useCase.execute(input);

      const savedPayload = familyRepository.save.mock.calls[0][0] as any;
      expect(savedPayload.residenceTypeOther).toBe('Outro tipo');
    });
  });
});
