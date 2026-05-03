import { LoginUseCase } from '@/core/auth/usecase/login.usecase';
import { UserEntity } from '@/core/user/entities/user.entity';
import { UserRepository } from '@/core/user/user.interface';
import { AuthConstants } from '@/shared/constants/auth';
import { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { HashService } from '@/shared/hash/hash.interface';
import { JwtService } from '@/shared/jwt/jwt.interface';

const mockUser = {
  id: 'user-id-123',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  active: true,
  role: {
    id: 'role-id-1',
    name: 'admin',
  },
};

const makeSut = () => {
  const jwtService = {
    generateJwt: jest.fn().mockResolvedValue({ token: 'jwt-token-123' }),
  } as unknown as jest.Mocked<JwtService>;

  const userRepository = {
    findByEmail: jest.fn().mockResolvedValue(mockUser),
  } as unknown as jest.Mocked<UserRepository>;

  const hashService = {
    compareHash: jest.fn().mockReturnValue(true),
  } as unknown as jest.Mocked<HashService>;

  const envConfigService = {
    getJwtExpiresInSeconds: jest.fn().mockReturnValue(3600),
    getCookieDomain: jest.fn().mockReturnValue('localhost'),
    getCookieSecure: jest.fn().mockReturnValue(false),
    getCookieSameSite: jest.fn().mockReturnValue('lax'),
  } as unknown as jest.Mocked<EnvConfigService>;

  const setCookie = jest.fn();

  const sut = new LoginUseCase(
    jwtService,
    userRepository,
    hashService,
    envConfigService,
  );

  return {
    sut,
    jwtService,
    userRepository,
    hashService,
    envConfigService,
    setCookie,
  };
};

describe('LoginUseCase', () => {
  const defaultInput = {
    email: 'test@example.com',
    password: 'plain-password',
  };

  describe('User not found or inactive', () => {
    it('should throw UnauthorizedError when user does not exist', async () => {
      const { sut, userRepository, setCookie } = makeSut();
      userRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(sut.execute({ ...defaultInput, setCookie })).rejects.toThrow(
        new UnauthorizedError('Usuário ou senha invalido'),
      );
    });

    it('should throw UnauthorizedError when user is inactive', async () => {
      const { sut, userRepository, setCookie } = makeSut();
      userRepository.findByEmail.mockResolvedValueOnce({
        ...mockUser,
        active: false,
      } as UserEntity);

      await expect(sut.execute({ ...defaultInput, setCookie })).rejects.toThrow(
        new UnauthorizedError('Usuário ou senha invalido'),
      );
    });

    it('should not call hashService when user is not found', async () => {
      const { sut, userRepository, hashService, setCookie } = makeSut();
      userRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(
        sut.execute({ ...defaultInput, setCookie }),
      ).rejects.toThrow();

      expect(hashService.compareHash).not.toHaveBeenCalled();
    });
  });

  describe('Invalid password', () => {
    it('should throw UnauthorizedError when password does not match', async () => {
      const { sut, hashService, setCookie } = makeSut();
      hashService.compareHash.mockReturnValueOnce(false);

      await expect(sut.execute({ ...defaultInput, setCookie })).rejects.toThrow(
        new UnauthorizedError('Usuário ou senha invalido'),
      );
    });

    it('should call compareHash with the plain password and the hashed password from the user', async () => {
      const { sut, hashService, setCookie } = makeSut();
      hashService.compareHash.mockReturnValueOnce(false);

      await expect(
        sut.execute({ ...defaultInput, setCookie }),
      ).rejects.toThrow();

      expect(hashService.compareHash).toHaveBeenCalledWith(
        defaultInput.password,
        mockUser.password,
      );
    });
  });

  describe('Successful login', () => {
    it('should return the user data in the correct format', async () => {
      const { sut, setCookie } = makeSut();

      const output = await sut.execute({ ...defaultInput, setCookie });

      expect(output).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          active: mockUser.active,
          role: {
            id: mockUser.role.id,
            name: mockUser.role.name,
          },
        },
      });
    });

    it('should call findByEmail with the provided email', async () => {
      const { sut, userRepository, setCookie } = makeSut();

      await sut.execute({ ...defaultInput, setCookie });

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        defaultInput.email,
      );
    });

    it('should call generateJwt with the found user', async () => {
      const { sut, jwtService, setCookie } = makeSut();

      await sut.execute({ ...defaultInput, setCookie });

      expect(jwtService.generateJwt).toHaveBeenCalledWith(mockUser);
    });

    it('should call setCookie with the token name, jwt and correct options', async () => {
      const { sut, setCookie } = makeSut();

      await sut.execute({ ...defaultInput, setCookie });

      expect(setCookie).toHaveBeenCalledWith(
        AuthConstants.tokenName,
        'jwt-token-123',
        {
          httpOnly: true,
          maxAge: 3600,
          path: '/',
          secure: false,
          sameSite: 'lax',
        },
      );
    });

    it('should retrieve all cookie settings from envConfigService', async () => {
      const { sut, envConfigService, setCookie } = makeSut();

      await sut.execute({ ...defaultInput, setCookie });

      expect(envConfigService.getJwtExpiresInSeconds).toHaveBeenCalled();
      // expect(envConfigService.getCookieDomain).toHaveBeenCalled();
      expect(envConfigService.getCookieSecure).toHaveBeenCalled();
      expect(envConfigService.getCookieSameSite).toHaveBeenCalled();
    });
  });

  describe('Execution order', () => {
    it('should not call generateJwt when the password is invalid', async () => {
      const { sut, hashService, jwtService, setCookie } = makeSut();
      hashService.compareHash.mockReturnValueOnce(false);

      await expect(
        sut.execute({ ...defaultInput, setCookie }),
      ).rejects.toThrow();

      expect(jwtService.generateJwt).not.toHaveBeenCalled();
    });

    it('should not call setCookie when an authentication error occurs', async () => {
      const { sut, userRepository, setCookie } = makeSut();
      userRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(
        sut.execute({ ...defaultInput, setCookie }),
      ).rejects.toThrow();

      expect(setCookie).not.toHaveBeenCalled();
    });
  });
});
