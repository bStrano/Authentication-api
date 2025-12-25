import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../../auth/services/auth.service';
import { ConflictException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<UserRepository>;
  let authService: jest.Mocked<AuthService>;

  const mockRegisterDto: RegisterDto = {
    email: 'newuser@example.com',
    password: 'StrongP@ssw0rd',
    name: 'New',
    lastName: 'User',
    platform: PlatformEnum.FINANCIAL,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(UserRepository);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: mockRegisterDto.email,
      } as any);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: mockRegisterDto.email,
      });
    });

    it('should create user and auto-login when email is available', async () => {
      const savedUser = {
        id: 1,
        email: mockRegisterDto.email,
        name: mockRegisterDto.name,
        lastName: mockRegisterDto.lastName,
        password: 'hashed-password',
      };

      const loginResponse = {
        id: 1,
        email: savedUser.email,
        name: savedUser.name,
        lastName: savedUser.lastName,
        accessToken: 'mock-token',
        refreshToken: {} as any,
      };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(savedUser as any);
      authService.login.mockResolvedValue(loginResponse as any);

      const result = await service.register(mockRegisterDto);

      expect(result).toEqual(loginResponse);
      expect(userRepository.save).toHaveBeenCalled();
      expect(authService.login).toHaveBeenCalledWith(
        savedUser,
        mockRegisterDto.platform,
      );
    });

    it('should hash password before saving', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockImplementation((user) =>
        Promise.resolve(user as any),
      );
      authService.login.mockResolvedValue({} as any);

      await service.register(mockRegisterDto);

      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.password).not.toBe(mockRegisterDto.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
    });
  });
});
