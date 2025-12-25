import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check application health status' })
  async check() {
    const memoryUsage = process.memoryUsage();
    let dbStatus = 'down';

    try {
      await this.dataSource.query('SELECT 1');
      dbStatus = 'up';
    } catch (error) {
      dbStatus = 'down';
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      info: {
        database: { status: dbStatus },
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        },
        uptime: `${Math.round(process.uptime())}s`,
      },
    };
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe - checks if app is running' })
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @ApiOperation({
    summary: 'Readiness probe - checks if app is ready to serve traffic',
  })
  async readiness() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
