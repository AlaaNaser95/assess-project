import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/modules/items/items.module';
import { UsersModule } from '../users/users.module';
import { Invoice } from './entity/invoice.entity';
import { InvoiceItem } from './entity/invoiceItem.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem]), ItemsModule, UsersModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [TypeOrmModule],
})
export class InvoiceModule {}
