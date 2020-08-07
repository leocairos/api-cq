import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterSampleAddFieldsCurrentStatus1596827001844
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('samples', [
      new TableColumn({
        name: 'sample_status_id',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'current_status_user_id',
        type: 'integer',
        isNullable: true,
      }),

      new TableColumn({
        name: 'current_status_edition_date_time',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('samples', 'sample_status_id');
    await queryRunner.dropColumn('samples', 'current_status_user_id');
    await queryRunner.dropColumn('samples', 'current_status_edition_date_time');
  }
}
