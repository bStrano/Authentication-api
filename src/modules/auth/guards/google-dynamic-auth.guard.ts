import { Injectable, ExecutionContext, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

@Injectable()
export class GoogleDynamicAuthGuard extends AuthGuard([
  'google-financial',
  'google-keychain',
  'google-life-gamification',
]) {
  private readonly strategyMap = new Map<PlatformEnum, string>([
    [PlatformEnum.FINANCIAL, 'google-financial'],
    [PlatformEnum.KEYCHAIN, 'google-keychain'],
    [PlatformEnum.LIFE_GAMIFICATION, 'google-life-gamification'],
  ]);

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // No callback, o platform vem do state
    let platform: number;
    if (request.query.state) {
      try {
        const state = JSON.parse(request.query.state);
        platform = state.platform;
      } catch {
        platform = null;
      }
    } else {
      // Na chamada inicial, vem do query
      platform = request.query.platform ? parseInt(request.query.platform) : null;
    }

    // Valida se a plataforma existe
    if (!platform || !this.strategyMap.has(platform)) {
      throw new BadRequestException(
        `Invalid or missing platform. Supported platforms: ${Array.from(this.strategyMap.keys()).join(', ')}`,
      );
    }

    const strategyName = this.strategyMap.get(platform);

    // Adiciona o platform no state para preservar no callback
    const options: any = {
      session: false,
      property: 'user',
      strategy: strategyName
    };

    // Se não for callback (não tem state), adiciona o state
    if (!request.query.state) {
      options.state = JSON.stringify({ platform });
    }

    return options;
  }
}
