import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateSampleAnalyses1596735274254
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample_analyses',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'order',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'measurement_unit',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'display_value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'value_float',
            type: 'decimal',
            precision: 14,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'reference_method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'method_analysis_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'conclusion',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sample_id',
            type: 'integer',
          },
          {
            name: 'method_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'analysis_group_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'info_id',
            type: 'integer',
            isNullable: true,
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
      'sample_analyses',
      new TableForeignKey({
        name: 'SampleAnalysesSample',
        columnNames: ['sample_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'samples',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_analyses',
      new TableForeignKey({
        name: 'SampleAnalysesMethod',
        columnNames: ['method_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'methods',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_analyses',
      new TableForeignKey({
        name: 'SampleAnalysesAnalysisGroup',
        columnNames: ['analysis_group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'analysis_groups',
      }),
    );

    await queryRunner.createForeignKey(
      'sample_analyses',
      new TableForeignKey({
        name: 'SampleAnalysesInfo',
        columnNames: ['info_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'infos',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sample_analyses', 'SampleAnalysesSample');
    await queryRunner.dropForeignKey('sample_analyses', 'SampleAnalysesMethod');
    await queryRunner.dropForeignKey(
      'sample_analyses',
      'SampleAnalysesAnalysisGroup',
    );
    await queryRunner.dropForeignKey('sample_analyses', 'SampleAnalysesInfo');

    await queryRunner.dropTable('sample_analyses');
  }
}
