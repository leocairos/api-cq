import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSampleTypes1596290284801
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sample_types',
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
    await queryRunner.dropTable('sample_types');
  }
}
