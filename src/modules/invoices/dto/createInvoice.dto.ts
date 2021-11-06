import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';
import { InvoiceItemDto } from './invoiceItem.dto';

export class CreateInvoiceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  invoiceItems!: InvoiceItemDto[];

  @IsInt()
  userId!: number;
}
