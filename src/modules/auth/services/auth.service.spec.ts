import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../session/services/refresh-token.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { EnvironmentService } from '../../../configs/environment/environment.service';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let sessionService: jest.Mocked<RefreshTokenService>;
  let environmentService: jest.Mocked<EnvironmentService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test',
    lastName: 'User',
    password: '$2b$10$hashedpassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            save: jest.fn(),
            findOneActive: jest.fn(),
            deleteByCode: jest.fn(),
          },
        },
        {
          provide: EnvironmentService,
          useValue: {
            accessTokenJwtConfig: jest.fn().mockReturnValue({
              secret: 'test-secret',
              expirationTime: 3600,
            }),
            refreshTokenJwtConfig: jest.fn().mockReturnValue({
              secret: 'test-refresh-secret',
              expirationTime: 24,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    sessionService = module.get(RefreshTokenService);
    environmentService = module.get(EnvironmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const password = 'testpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      userRepository.findOne.mockResolvedValue(userWithPassword);

      const result = await service.validateUser('test@example.com', password);

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBeUndefined();
    });

    it('should return null when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('wrong@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const userWithPassword = { ...mockUser, password: hashedPassword };

      userRepository.findOne.mockResolvedValue(userWithPassword);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate access token and refresh token', async () => {
      const mockRefreshToken = {
        id: 1,
        code: 'mock-refresh-token',
        userId: mockUser.id,
        platform: PlatformEnum.FINANCIAL,
        expiryAt: new Date(),
      };

      jwtService.sign.mockReturnValue('mock-access-token');
      sessionService.save.mockResolvedValue(mockRefreshToken as any);

      const result = await service.login(mockUser, PlatformEnum.FINANCIAL);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toEqual(mockRefreshToken);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(sessionService.save).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should delete refresh token', async () => {
      const userId = 1;
      const refreshTokenCode = 'mock-token';

      sessionService.deleteByCode.mockResolvedValue(undefined);

      await service.logout(userId, refreshTokenCode);

      expect(sessionService.deleteByCode).toHaveBeenCalledWith(userId, refreshTokenCode);
    });
  });
});
