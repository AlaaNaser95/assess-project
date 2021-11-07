import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/modules/items/entity/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { UpdateInvoiceDto } from './dto/updteInvoice.dto';
import { Invoice } from './entity/invoice.entity';
import { InvoiceItem } from './entity/invoiceItem.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
  ) {}

  async createInvoice(createInvoiceDto): Promise<Invoice> {
    const user = await this.userRepository.findOne(createInvoiceDto.userId);
    if (!user) throw new NotFoundException(`user not found.`);
    let invoiceItems = createInvoiceDto.invoiceItems;
    //get invoice items from database
    const itemIds = invoiceItems.map((invoiceItem) => invoiceItem.itemId);
    const items = await this.itemRepository.findByIds(itemIds);
    //check if some items are not found and throw exception
    if (itemIds.length != items.length) {
      const returnedItemIds = items.map((item) => item.id);
      let difference = itemIds.filter((x) => !returnedItemIds.includes(x));
      throw new NotFoundException(
        `Items ${JSON.stringify(difference)} are not found.`,
      );
    }
    //creating invoice
    const invoice = new Invoice();
    invoice.userId = user.id;
    let createdInvoice = await this.invoiceRepository.save(invoice);
    let totalInvoicePrice = 0;
    //creating invoice items
    invoiceItems = invoiceItems.map((invoiceItem) => {
      const item = items.filter((item) => item.id === invoiceItem.itemId);
      invoiceItem.totalPrice = item[0].price * invoiceItem.quantity;
      invoiceItem.invoiceId = createdInvoice.id;
      invoiceItem.itemName = item[0].name;
      totalInvoicePrice += invoiceItem.totalPrice;
      return invoiceItem;
    });
    await this.invoiceItemRepository.save(invoiceItems);
    //saving total price for invoice
    invoice.totalPrice = totalInvoicePrice;
    await this.invoiceRepository.save(invoice);

    return await this.invoiceRepository.findOne(invoice.id);
  }

  async listInvoices(
    page: number,
    limit: number,
    userId: number | undefined,
  ): Promise<{ data: Invoice[]; count: number; page: number; limit: number }> {
    let filter = {
      take: limit,
      skip: limit * (page - 1),
    };
    if (userId) {
      filter = Object.assign(filter, { userId });
    }
    console.log(filter);
    const [result, total] = await this.invoiceRepository.findAndCount(filter);

    return { data: result, count: total, page, limit };
  }

  async getInvoice(id: number): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);
    return invoice;
  }

  async updateInvoice(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);
    await this.invoiceRepository.update(id, updateInvoiceDto);

    return await this.getInvoiceById(id);
  }

  async deleteInvoice(id: number): Promise<string> {
    const invoice = await this.getInvoiceById(id);
    await this.invoiceRepository.delete(id);
    return `Invoice with id ${id} has been deleted`;
  }

  private async getInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }
    return invoice;
  }
}
