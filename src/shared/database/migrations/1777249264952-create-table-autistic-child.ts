import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableAutisticChild1777249264952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'autist-child',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'mother_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'father_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'autism_condition',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'support_level',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'comorbidities',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'comorbidities_other',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'multiprofessional_support',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'uses_medication',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'medication_names',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'school_grade',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'school_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'updateToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'family_id',
            type: 'uuid',
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
        ],
        foreignKeys: [
          {
            name: 'FK_autist_child_family',
            columnNames: ['family_id'],
            referencedTableName: 'family',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
