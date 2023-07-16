import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {MigrationCommon} from "../MigrationCommon";

export class CreateTableUsers1688928552677 extends MigrationCommon implements MigrationInterface {

    constructor() {
        super('users');
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: this.tableName,
            columns: [
                this.getIdColumn(),
                {
                    name: 'name',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                },
                {
                    name: 'email',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'VARCHAR(255)',
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
