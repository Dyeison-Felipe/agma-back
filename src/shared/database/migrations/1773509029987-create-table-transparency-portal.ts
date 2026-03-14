import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableTransparencyPortal1773509029987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transparency-portal',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'path',
            type: 'varchar',
            isNullable: false,
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'transparencyType',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'transparency-portal',
      new TableForeignKey({
        columnNames: ['transparencyType'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transparency-type',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
