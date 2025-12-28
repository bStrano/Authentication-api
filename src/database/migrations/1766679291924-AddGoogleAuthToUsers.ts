import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGoogleAuthToUsers1766679291924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'google_id',
        type: 'VARCHAR(255)',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'profile_picture',
        type: 'TEXT',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'google_id');
    await queryRunner.dropColumn('users', 'profile_picture');
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
  }
}
