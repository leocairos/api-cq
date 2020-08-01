import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterSamplesAddSampleConclusion1596318419723
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'samples',
      new TableColumn({
        name: 'sample_conclusion_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'samples',
      new TableForeignKey({
        name: 'SampleConclusion',
        columnNames: ['sample_conclusion_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sample_conclusions',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('samples', 'SampleConclusion');
    await queryRunner.dropColumn('samples', 'sample_conclusion_id');
  }
}
