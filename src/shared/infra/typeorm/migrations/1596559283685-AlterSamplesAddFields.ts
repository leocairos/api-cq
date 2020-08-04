import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterSamplesAddFields1596559283685
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('samples', [
      new TableColumn({
        name: 'control_number',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'number',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'year',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'sub_number',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'revision',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'active',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'sync_portal',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'received',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'finalized',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'published',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'reviewed',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'taken_date_time',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'received_time',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'finalized_time',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'published_time',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'reviewed_time',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('samples', 'control_number');
    await queryRunner.dropColumn('samples', 'number');
    await queryRunner.dropColumn('samples', 'year');
    await queryRunner.dropColumn('samples', 'sub_number');
    await queryRunner.dropColumn('samples', 'revision');
    await queryRunner.dropColumn('samples', 'active');
    await queryRunner.dropColumn('samples', 'sync_portal');
    await queryRunner.dropColumn('samples', 'received');
    await queryRunner.dropColumn('samples', 'finalized');
    await queryRunner.dropColumn('samples', 'published');
    await queryRunner.dropColumn('samples', 'reviewed');
    await queryRunner.dropColumn('samples', 'taken_date_time');
    await queryRunner.dropColumn('samples', 'received_time');
    await queryRunner.dropColumn('samples', 'finalized_time');
    await queryRunner.dropColumn('samples', 'published_time');
    await queryRunner.dropColumn('samples', 'reviewed_time');
  }
}
