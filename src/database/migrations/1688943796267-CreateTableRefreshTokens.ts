import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {MigrationCommon} from "../MigrationCommon";

export class CreateTableRefreshTokens1688943796267  extends MigrationCommon implements MigrationInterface {
    constructor() {
        super('refreshTokens');
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: this.tableName,
            columns: [
                this.getIdColumn(),
                {
                    name: 'code',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'userId',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'platform',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                },
                {
                  name: 'expiryAt',
                  type: 'TIMESTAMP(6) WITH TIME ZONE',
                    isNullable: false,
                },
                ...this.getTimestampColumns(),
            ],
        })
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName)
    }
}
