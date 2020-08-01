import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSampleStatus1596292227550
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample_status',
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
    await queryRunner.dropTable('sample_status');
  }
}
