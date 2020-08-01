import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsersMyLIMS1596290577104
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mylims_users',
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
    await queryRunner.dropTable('mylims_users');
  }
}
