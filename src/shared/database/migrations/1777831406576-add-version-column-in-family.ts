import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVersionColumnInFamily1777831406576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('family', 'version');
    if (hasColumn) return;

    await queryRunner.addColumn(
      'family',
      new TableColumn({
        name: 'version',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
