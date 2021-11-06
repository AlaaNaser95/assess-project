import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { UpdateInvoiceDto } from './dto/updteInvoice.dto';
import { Invoice } from './entity/invoice.entity';
import { InvoicesService } from './invoices.service';
import { PaginationInterceptor } from 'src/pagination.interceptor';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  createUser(@Body() creteInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoicesService.createInvoice(creteInvoiceDto);
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  listInvoices(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('user_id') userId: number | undefined,
  ): Promise<{ data: Invoice[]; count: number; page: number; limit: number }> {
    return this.invoicesService.listInvoices(page, limit, userId);
  }

  @Get(':id')
  getInvoice(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Invoice> {
    return this.invoicesService.getInvoice(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoicesService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.invoicesService.deleteInvoice(id);
  }
}
