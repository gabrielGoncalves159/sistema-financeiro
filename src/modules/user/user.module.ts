import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../../auth/auth.module';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,    
  ],
  controllers: [
    UserController
  ],
  exports: [
    UserService,
    TypeOrmModule,
  ],
})
export class UserModule {}
