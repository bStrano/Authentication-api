import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsUsers1691025500360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lastName',
        type: 'VARCHAR(255)',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lastName');
  }
}
