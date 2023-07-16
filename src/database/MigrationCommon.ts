import {QueryRunner, TableColumnOptions} from 'typeorm';

/**
 * This class was made to run common commands on migration
 */
export abstract class MigrationCommon {
    protected constructor(protected readonly tableName: string) {
        this.tableName = tableName;
    }

    protected getIdColumn(): TableColumnOptions {
        return {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
        };
    }

    protected getTimestampColumns(): TableColumnOptions[] {
        return [
            {
                name: 'createdAt',
                type: 'TIMESTAMP(6) WITH TIME ZONE default current_timestamp',
                isNullable: false,
            },
            {
                name: 'updatedAt',
                type: 'TIMESTAMP(6) WITH TIME ZONE',
                isNullable: true,
            },
        ];
    }

    protected async generateCommonTriggers(queryRunner: QueryRunner) {
        await this.generateTimestampTrigger(queryRunner);
    }

    private generateTimestampTrigger(queryRunner: QueryRunner) {
        return queryRunner.query(
            `
            create trigger ${this.tableName}_TIMESTAMPS before insert or update
                on "${this.tableName}"
                for each row
                BEGIN
                    :new.UPDATED_AT := SYSTIMESTAMP;
                END;`,
        );
    }
}
