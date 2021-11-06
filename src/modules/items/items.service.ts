import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './entity/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemRepository.save(createItemDto);
  }

  async listItems(
    page: number,
    limit: number,
  ): Promise<{ data: Item[]; count: number; page: number; limit: number }> {
    const [result, total] = await this.itemRepository.findAndCount({
      take: limit,
      skip: limit * (page - 1),
    });
    return { data: result, count: total, page, limit };
  }

  async getItem(id: number): Promise<Item> {
    const item = await this.getItemById(id);
    return item;
  }

  async updateItem(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.getItemById(id);
    await this.itemRepository.update(id, updateItemDto);
    return await this.getItemById(id);
  }

  async deleteItem(id: number): Promise<string> {
    const item = await this.getItemById(id);
    await this.itemRepository.delete(id);
    return `Item with id ${id} has been deleted`;
  }

  private async getItemById(id: number): Promise<Item> {
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException('Item not found.');
    }
    return item;
  }
}
