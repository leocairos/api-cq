import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSamples1595610121140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'samples',
        columns: [
          {
            name: 'Id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'Identification',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'Number',
            type: 'integer',
          },
          {
            name: 'Year',
            type: 'integer',
          },
          {
            name: 'SubNumber',
            type: 'integer',
          },
          {
            name: 'Revision',
            type: 'integer',
          },
          {
            name: 'Active',
            type: 'boolean',
          },
          {
            name: 'TakenDateTime',
            type: 'timestamp',
          },
          {
            name: 'ReceivedTime',
            type: 'timestamp',
          },
          {
            name: 'FinalizedTime',
            type: 'timestamp',
          },
          {
            name: 'PublishedTime',
            type: 'timestamp',
          },
          {
            name: 'ReviewedTime',
            type: 'timestamp',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('samples');
  }
}
