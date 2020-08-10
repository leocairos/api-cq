import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AlterSamplesAddForeignKeys1597083625817
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'samples',
      new TableForeignKey({
        name: 'SampleCurrentStatus',
        columnNames: ['sample_status_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sample_status',
      }),
    );

    await queryRunner.createForeignKey(
      'samples',
      new TableForeignKey({
        name: 'SampleCurrentStatusUser',
        columnNames: ['current_status_user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mylims_users',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('samples', 'SampleCurrentStatus');
    await queryRunner.dropForeignKey('samples', 'SampleCurrentStatusUser');
  }
}
