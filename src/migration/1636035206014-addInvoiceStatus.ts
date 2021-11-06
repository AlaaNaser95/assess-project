import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addInvoiceStatus1636035206014 implements MigrationInterface {
  name = 'addInvoiceStatus1636035206014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoice',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        default: "'Placed'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoice', 'status');
  }
}
