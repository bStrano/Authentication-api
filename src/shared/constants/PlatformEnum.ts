import { InternalServerErrorException } from '@nestjs/common';

export enum PlatformEnum {
  FINANCIAL = 1,
  KEYCHAIN = 2,
}

export const lookupPlatformName = (platform: PlatformEnum) => {
  switch (platform) {
    case PlatformEnum.FINANCIAL:
      return 'FINANCIAL';
    case PlatformEnum.KEYCHAIN:
      return 'KEYCHAIN';
    default:
      throw new InternalServerErrorException(`Platform ${platform} invalid`);
  }
};
