import { Injectable, ExecutionContext, BadRequestException, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

@Injectable()
export class GoogleDynamicAuthGuard implements CanActivate {
  private readonly strategyMap = new Map<PlatformEnum, string>([
    [PlatformEnum.FINANCIAL, 'google-financial'],
    [PlatformEnum.KEYCHAIN, 'google-keychain'],
    [PlatformEnum.LIFE_GAMIFICATION, 'google-life-gamification'],
  ]);

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    // Cria um guard dinamicamente com a estratégia correta
    const DynamicGuard = class extends AuthGuard(strategyName) {
      getAuthenticateOptions() {
        // Se não for callback, adiciona o state
        if (!request.query.state) {
          return {
            session: false,
            state: JSON.stringify({ platform }),
          };
        }
        return { session: false };
      }
    };

    const guard = new DynamicGuard();
    return guard.canActivate(context) as Promise<boolean>;
  }
}
