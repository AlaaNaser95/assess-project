import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class InvoiceItemDto {
  @IsNotEmpty()
  @IsInt()
  itemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
