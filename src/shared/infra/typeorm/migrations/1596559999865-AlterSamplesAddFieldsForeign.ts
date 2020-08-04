import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterSamplesAddFieldsForeign1596559999865
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'samples',
      new TableColumn({
        name: 'sample_reason_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'samples',
      new TableForeignKey({
        name: 'SampleReason',
        columnNames: ['sample_reason_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sample_reasons',
      }),
    );

    await queryRunner.addColumn(
      'samples',
      new TableColumn({
        name: 'sample_type_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'samples',
      new TableForeignKey({
        name: 'SampleType',
        columnNames: ['sample_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sample_types',
      }),
    );

    await queryRunner.addColumn(
      'samples',
      new TableColumn({
        name: 'sample_collection_point_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'samples',
      new TableForeignKey({
        name: 'SampleCollectionPoint',
        columnNames: ['sample_collection_point_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'collection_points',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('samples', 'SampleReason');
    await queryRunner.dropColumn('samples', 'sample_reason_id');

    await queryRunner.dropForeignKey('samples', 'SampleType');
    await queryRunner.dropColumn('samples', 'sample_type_id');

    await queryRunner.dropForeignKey('samples', 'SampleCollectionPoint');
    await queryRunner.dropColumn('samples', 'sample_collection_point_id');
  }
}
