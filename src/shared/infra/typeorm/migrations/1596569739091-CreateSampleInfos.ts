import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateSampleInfos1596569739091
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample_infos',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'order',
            type: 'integer',
          },
          {
            name: 'display_value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'info_id',
            type: 'integer',
          },
          {
            name: 'sample_id',
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
      'sample_infos',
      new TableForeignKey({
        name: 'SampleInfoInfo',
        columnNames: ['info_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'infos',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_infos',
      new TableForeignKey({
        name: 'SampleInfoSample',
        columnNames: ['sample_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'samples',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sample_infos', 'SampleInfoInfo');
    await queryRunner.dropForeignKey('sample_infos', 'SampleInfoSample');
    await queryRunner.dropTable('sample_infos');
  }
}
