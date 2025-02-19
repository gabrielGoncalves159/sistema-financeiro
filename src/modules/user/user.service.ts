import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { hashPassword } from 'src/utils/hash-password';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const {email, password} = dto;

    const existingUser = await this.userRepository.findOne({where: [{email}]})
    if(existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({ ...dto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async getUserById(userId: number) : Promise<User | null> {
    const user = this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string) : Promise<User | null> {
    const user = this.userRepository.findOne({ where: { email } });
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
