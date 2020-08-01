import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSamples1596311274340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'samples',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'identification',
            type: 'varchar',
          },
          {
            name: 'service_center_id',
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
        foreignKeys: [
          {
            name: 'ServiceCenter',
            referencedTableName: 'service_centers',
            referencedColumnNames: ['id'],
            columnNames: ['service_center_id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('samples');
  }
}
