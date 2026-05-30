import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersTbl } from './entity/users.tbl';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersTbl)
    private readonly usersRepo: Repository<UsersTbl>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    emailAddress: string,
    password: string,
  ): Promise<UsersTbl | null> {
    const users = await this.usersRepo.findOne({ where: { emailAddress } });

    if (!users) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, users.password);

    if (!isPasswordValid) {
      return null;
    }

    return users;
  }

  async login(users: UsersTbl): Promise<string> {
    const payload = {
      sub: users.userId,
      userId: users.userId,
      emailAddress: users.emailAddress,
      role: users.role,
    };

    return this.jwtService.signAsync(payload);
  }
}
