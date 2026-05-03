import { FamilyRepository } from '@/core/family/family.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { FindFamilyByIdUseCase } from '../find-family-by-id.usecase';

jest.mock('@/shared/decorators/transactional.decorator', () => ({
  Transactional:
    () => (_target: any, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

const VALID_TOKEN = 'valid-token-123';

const makeChild = (overrides = {}) => ({
  id: 'child-id-1',
  fullName: 'Filho Teste',
  ...overrides,
});

const makeFamily = (overrides = {}) => ({
  id: 'family-id-1',
  email: 'familia@email.com',
  respondentCpf: '12345678909',
  updateToken: VALID_TOKEN,
  autisticChild: [makeChild()],
  ...overrides,
});

const makeInput = (overrides = {}) => ({
  cpf: '12345678909',
  token: VALID_TOKEN,
  ...overrides,
});

describe('FindFamilyByIdUseCase', () => {
  let useCase: FindFamilyByIdUseCase;
  let familyRepository: jest.Mocked<FamilyRepository>;

  beforeEach(() => {
    familyRepository = {
      findByCpf: jest.fn(),
    } as any;

    useCase = new FindFamilyByIdUseCase(familyRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('quando a família não é encontrada pelo CPF', () => {
    it('deve lançar NotFoundError', async () => {
      familyRepository.findByCpf.mockResolvedValue(null);

      await expect(useCase.execute(makeInput())).rejects.toThrow(NotFoundError);
      await expect(useCase.execute(makeInput())).rejects.toThrow(
        'Família não encontrada',
      );
    });

    it('deve buscar pelo CPF informado no input', async () => {
      familyRepository.findByCpf.mockResolvedValue(null);

      await expect(useCase.execute(makeInput())).rejects.toThrow(NotFoundError);

      expect(familyRepository.findByCpf).toHaveBeenCalledWith('12345678909');
    });
  });

  describe('quando o token é inválido ou ausente', () => {
    it('deve lançar UnauthorizedError quando updateToken da família é null', async () => {
      familyRepository.findByCpf.mockResolvedValue(
        makeFamily({ updateToken: null }) as any,
      );

      await expect(useCase.execute(makeInput())).rejects.toThrow(
        UnauthorizedError,
      );
      await expect(useCase.execute(makeInput())).rejects.toThrow(
        'Não autorizado',
      );
    });

    it('deve lançar UnauthorizedError quando updateToken da família é undefined', async () => {
      familyRepository.findByCpf.mockResolvedValue(
        makeFamily({ updateToken: undefined }) as any,
      );

      await expect(useCase.execute(makeInput())).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('deve lançar UnauthorizedError quando o token do input não bate com o da família', async () => {
      familyRepository.findByCpf.mockResolvedValue(makeFamily() as any);

      await expect(
        useCase.execute(makeInput({ token: 'wrong-token' })),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('deve lançar UnauthorizedError quando o token é string vazia', async () => {
      familyRepository.findByCpf.mockResolvedValue(makeFamily() as any);

      await expect(useCase.execute(makeInput({ token: '' }))).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('quando CPF e token são válidos', () => {
    it('deve retornar family e autisticChildren no output', async () => {
      const family = makeFamily();
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.family).toBeDefined();
      expect(result.autisticChildren).toBeDefined();
    });

    it('deve retornar os filhos da família no output', async () => {
      const child = makeChild({ fullName: 'Criança Teste' });
      const family = makeFamily({ autisticChild: [child] });
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.autisticChildren).toEqual([child]);
    });

    it('deve retornar lista vazia quando família não tem filhos cadastrados', async () => {
      const family = makeFamily({ autisticChild: null });
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.autisticChildren).toEqual([]);
    });

    it('deve retornar lista vazia quando autisticChild é undefined', async () => {
      const family = makeFamily({ autisticChild: undefined });
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.autisticChildren).toEqual([]);
    });

    it('não deve incluir autisticChild dentro do objeto family do output', async () => {
      const family = makeFamily();
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.family).not.toHaveProperty('autisticChild');
    });

    it('deve preservar os demais campos da família no output', async () => {
      const family = makeFamily();
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.family).toMatchObject({
        id: family.id,
        email: family.email,
        respondentCpf: family.respondentCpf,
        updateToken: family.updateToken,
      });
    });

    it('deve retornar múltiplos filhos corretamente', async () => {
      const children = [
        makeChild({ id: 'child-1', fullName: 'Filho 1' }),
        makeChild({ id: 'child-2', fullName: 'Filho 2' }),
      ];
      const family = makeFamily({ autisticChild: children });
      familyRepository.findByCpf.mockResolvedValue(family as any);

      const result = await useCase.execute(makeInput());

      expect(result.autisticChildren).toHaveLength(2);
      expect(result.autisticChildren).toEqual(children);
    });
  });
});
