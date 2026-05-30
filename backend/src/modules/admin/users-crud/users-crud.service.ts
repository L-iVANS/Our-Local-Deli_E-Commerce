import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersTbl } from '../../general/auth/entity/users.tbl';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersCrudService {
  constructor(
    @InjectRepository(UsersTbl) private usersRepository: Repository<UsersTbl>,
  ) {}

  async allUsers() {
    return await this.usersRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);

    if (!newUser) {
      throw new NotFoundException('Failed to create user');
    }

    return await this.usersRepository.save(newUser);
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { userId: updateUserDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${updateUserDto.userId} not found`,
      );
    }

    this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async deleteUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return await this.usersRepository.remove(user);
  }

  async readProfile(userId: number) {
    return await this.usersRepository.findOne({ where: { userId } });
  }
}
