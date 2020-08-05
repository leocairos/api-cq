import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateServiceAreas1596645747747
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'service_areas',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'identification',
            type: 'varchar',
            isNullable: true,
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
      }),
    );

    await queryRunner.createForeignKey(
      'service_areas',
      new TableForeignKey({
        name: 'ServiceAreaServiceCenter',
        columnNames: ['service_center_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'service_centers',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'service_areas',
      'ServiceAreaServiceCenter',
    );

    await queryRunner.dropTable('service_areas');
  }
}
