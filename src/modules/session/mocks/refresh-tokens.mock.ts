import { RefreshTokens } from '../entities/refresh.tokens.entity';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

export const REFRESH_TOKENS_MOCK: RefreshTokens[] = [
  {
    id: 1,
    code: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    createdAt: new Date(),
    expiryAt: new Date(),
    userId: 1,
    platform: PlatformEnum.FINANCIAL,
  },
];
