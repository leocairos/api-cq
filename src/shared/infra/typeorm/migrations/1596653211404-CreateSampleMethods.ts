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
          {
            name: 'method_status_id',
            type: 'integer',
          },
          {
            name: 'edition_user_id',
            type: 'integer',
          },
          {
            name: 'edition_date_time',
            type: 'timestamp',
          },
          {
            name: 'execute_user_id',
            type: 'integer',
          },
          {
            name: 'start_user_id',
            type: 'integer',
          },

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
        name: 'SampleInfoInfo',
        columnNames: ['info_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'infos',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_methods',
      new TableForeignKey({
        name: 'SampleInfoSample',
        columnNames: ['sample_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'samples',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sample_methods', 'SampleInfoInfo');
    await queryRunner.dropForeignKey('sample_methods', 'SampleInfoSample');
    await queryRunner.dropTable('sample_methods');
  }
}
