import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async listUsers(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; count: number; page: number; limit: number }> {
    const [result, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: limit * (page - 1),
    });
    return { data: result, count: total, page, limit };
  }

  async getUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.getUserById(id);
    await this.userRepository.update(id, updateUserDto);
    return await this.getUserById(id);
  }

  async deleteUser(id: number): Promise<string> {
    const user = await this.getUserById(id);
    await this.userRepository.delete(id);
    return `User with id ${id} has been deleted`;
  }

  private async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
