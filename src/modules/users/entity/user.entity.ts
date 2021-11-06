import { BaseEntity } from 'src/base.entity';
import { Invoice } from 'src/modules/invoices/entity/invoice.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}
