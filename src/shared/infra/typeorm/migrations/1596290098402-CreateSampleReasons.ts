import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSampleReasons1596290098402
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample_reasons',
        columns: [
          {
            name: 'Id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'Identification',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sample_reasons');
  }
}
