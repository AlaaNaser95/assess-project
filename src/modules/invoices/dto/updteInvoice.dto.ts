import { IsIn } from 'class-validator';

export class UpdateInvoiceDto {
  @IsIn(['placed', 'delivered', 'cancelled'])
  status: string;
}
