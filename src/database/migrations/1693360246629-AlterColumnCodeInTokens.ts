import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterColumnCodeInTokens1693360246629
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ALTER COLUMN "code" TYPE varchar(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ALTER COLUMN "code" TYPE varchar(255)`,
    );
  }
}
