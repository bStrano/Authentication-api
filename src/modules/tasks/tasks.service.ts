import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenService } from '../session/services/refresh-token.service';

/**
 * Service responsible for scheduled tasks and cron jobs
 */
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Cron job to clean up expired refresh tokens
   * Runs every day at 2:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupExpiredTokens() {
    try {
      this.logger.log('Starting cleanup of expired refresh tokens...');

      const deletedCount = await this.refreshTokenService.cleanupExpiredTokens();

      this.logger.log(
        `Cleanup completed. Removed ${deletedCount} expired tokens.`,
      );
    } catch (error) {
      this.logger.error('Failed to cleanup expired tokens', error.stack);
    }
  }
}
