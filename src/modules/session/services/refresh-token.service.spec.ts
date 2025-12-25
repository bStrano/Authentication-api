import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RefreshTokens } from '../entities/refresh.tokens.entity';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let repository: jest.Mocked<RefreshTokenRepository>;

  const mockRefreshToken: RefreshTokens = {
    id: 1,
    code: 'mock-token-code',
    userId: 1,
    platform: PlatformEnum.FINANCIAL,
    expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdAt: new Date(),
    updatedAt: new Date(),
  } as RefreshTokens;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: RefreshTokenRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            deleteByCode: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
    repository = module.get(RefreshTokenRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneActive', () => {
    it('should return token when valid and not expired', async () => {
      repository.findOne.mockResolvedValue(mockRefreshToken);

      const result = await service.findOneActive('mock-token-code');

      expect(result).toEqual(mockRefreshToken);
      expect(repository.findOne).toHaveBeenCalledWith({ code: 'mock-token-code' });
    });

    it('should throw ForbiddenException when token not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneActive('invalid-token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when token is expired', async () => {
      const expiredToken = {
        ...mockRefreshToken,
        expiryAt: new Date(Date.now() - 1000), // 1 second ago
      };
      repository.findOne.mockResolvedValue(expiredToken);

      await expect(service.findOneActive('expired-token')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deleteByCode', () => {
    it('should delete token when found', async () => {
      repository.findOne.mockResolvedValue(mockRefreshToken);
      repository.deleteByCode.mockResolvedValue(undefined);

      await service.deleteByCode(1, 'mock-token-code');

      expect(repository.deleteByCode).toHaveBeenCalledWith('mock-token-code');
    });

    it('should throw NotFoundException when token not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.deleteByCode(1, 'invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('save', () => {
    it('should save refresh token', async () => {
      repository.save.mockResolvedValue(mockRefreshToken);

      const result = await service.save(mockRefreshToken);

      expect(result).toEqual(mockRefreshToken);
      expect(repository.save).toHaveBeenCalledWith(mockRefreshToken);
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should delete expired tokens and return count', async () => {
      repository.delete.mockResolvedValue({ affected: 5 } as any);

      const result = await service.cleanupExpiredTokens();

      expect(result).toBe(5);
      expect(repository.delete).toHaveBeenCalled();
    });

    it('should return 0 when no tokens deleted', async () => {
      repository.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await service.cleanupExpiredTokens();

      expect(result).toBe(0);
    });
  });
});
