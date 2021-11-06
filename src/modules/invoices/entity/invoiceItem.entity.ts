import { Item } from 'src/modules/items/entity/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: true })
  public itemId: number;

  @Column()
  public itemName: string;

  @Column()
  public invoiceId!: number;

  @Column({ type: 'int', default: 1 })
  public quantity!: number;

  @Column({ type: 'float', precision: 3 })
  public totalPrice!: number;

  @ManyToOne(() => Item, (item) => item.invoiceItems, {
    onDelete: 'SET NULL',
  })
  public item: Item;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, {
    onDelete: 'CASCADE',
  })
  public invoice!: Invoice;
}
