import { InternalServerErrorException } from '@nestjs/common';

export enum PlatformEnum {
  FINANCIAL = 1,
  KEYCHAIN = 2,
  AUTHENTICATION = 3,
}

export const lookupPlatformName = (platform: PlatformEnum) => {
  switch (platform) {
    case PlatformEnum.FINANCIAL:
      return 'FINANCIAL';
    case PlatformEnum.KEYCHAIN:
      return 'KEYCHAIN';
    case PlatformEnum.AUTHENTICATION:
      return 'AUTH';
    default:
      throw new InternalServerErrorException(`Platform ${platform} invalid`);
  }
};
