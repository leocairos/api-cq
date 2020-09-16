import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterSampleAddHashMailUpdated1600275347743
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'samples',
      new TableColumn({
        name: 'hash_mail',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('samples', 'hash_mail');
  }
}
