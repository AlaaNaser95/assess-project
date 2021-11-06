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
import { PaginationInterceptor } from 'src/pagination.interceptor';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './entity/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  createitem(@Body() creteitemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.createItem(creteitemDto);
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  listItems(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<{ data: Item[]; count: number; page: number; limit: number }> {
    return this.itemsService.listItems(page, limit);
  }

  @Get(':id')
  getitem(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Item> {
    return this.itemsService.getItem(id);
  }

  @Put(':id')
  updateitem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateitemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.updateItem(id, updateitemDto);
  }

  @Delete(':id')
  deleteitem(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.itemsService.deleteItem(id);
  }
}
