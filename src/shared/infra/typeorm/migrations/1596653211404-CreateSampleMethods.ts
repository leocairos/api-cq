import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateSampleMethods1596653211404
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample_methods',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'sample_id',
            type: 'integer',
          },
          {
            name: 'method_id',
            type: 'integer',
          },
          {
            name: 'service_area_id',
            type: 'integer',
          },
          // Begin CurrentStatus
          {
            name: 'method_status_id',
            type: 'integer',
          },
          {
            name: 'edition_user_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'edition_data_time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'execute_user_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'execute_data_time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'start_user_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'start_data_time',
            type: 'timestamp',
            isNullable: true,
          },
          // End CurrentStatus
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodSample',
        columnNames: ['sample_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'samples',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodMethod',
        columnNames: ['method_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'methods',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodServiceArea',
        columnNames: ['service_area_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'service_areas',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodMethodStatus',
        columnNames: ['method_status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'method_status',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodEditionUser',
        columnNames: ['edition_user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mylims_users',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodExecuteUser',
        columnNames: ['execute_user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mylims_users',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleMethodStartUser',
        columnNames: ['start_user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mylims_users',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sample_methods', 'SampleMethodSample');
    await queryRunner.dropForeignKey('sample_methods', 'SampleMethodMethod');
    await queryRunner.dropForeignKey(
      'sample_methods',
      'SampleMethodServiceArea',
    );
    await queryRunner.dropForeignKey(
      'sample_methods',
      'SampleMethodMethodStatus',
    );
    await queryRunner.dropForeignKey(
      'sample_methods',
      'SampleMethodEditionUser',
    );
    await queryRunner.dropForeignKey(
      'sample_methods',
      'SampleMethodExecuteUser',
    );
    await queryRunner.dropForeignKey('sample_methods', 'SampleMethodStartUser');
    await queryRunner.dropTable('sample_methods');
  }
}
