import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTbl } from '../../general/auth/entity/users.tbl';
import { UsersCrudService } from './users-crud.service';
import { UsersCrudController } from './users-crud.controller';
import { AuthModule } from '../../general/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersTbl]), AuthModule],
  controllers: [UsersCrudController],
  providers: [UsersCrudService],
})
export class UsersCrudModule {}
