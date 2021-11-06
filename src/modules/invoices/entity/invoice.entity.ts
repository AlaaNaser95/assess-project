import { BaseEntity } from 'src/base.entity';
import { User } from 'src/modules/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { InvoiceItem } from './invoiceItem.entity';

@Entity()
export class Invoice extends BaseEntity {
  @Column({ type: 'float', precision: 3, default: 0 })
  totalPrice!: number;

  @Column()
  userId!: number;

  @Column()
  status!: string;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, {
    eager: true,
  })
  invoiceItems: InvoiceItem[];

  @ManyToOne(() => User, (user) => user.invoices, {
    eager: true,
  })
  user: User;
}
