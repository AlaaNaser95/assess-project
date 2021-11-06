import { BaseEntity } from 'src/base.entity';
import { InvoiceItem } from 'src/modules/invoices/entity/invoiceItem.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Item extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'float', precision: 3, default: 0 })
  price!: number;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.item)
  public invoiceItems: InvoiceItem[];
}
