import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFamily1777249217760 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'family',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'respondent',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'respondent_other',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'respondent_cpf',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },
          {
            name: 'family_income',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'image_authorization',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'number_of_children',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'residence_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'residence_type_other',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cep',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'street',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'reference_point',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mother_phone',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'father_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'step_parent_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bpc',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cras_registration',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'municipal_card',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'ciptea',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'updateToken',
            type: 'varchar',
            isNullable: true,
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
