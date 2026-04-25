import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTypeQuestion1777141033112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'type-question',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
  INSERT INTO "type-question" (id, type) VALUES
    ('98ebd61f-761f-4726-a8d6-f6bffb9829bc', 'resposta de texto'),
    ('84fcf06e-9e29-48dd-a366-b2a334187ab7', 'multipla escolha'),
    ('a6b6ce44-5b4f-462c-9b40-61f25c03c67b', 'opção unica')
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
