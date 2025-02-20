import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsObject({ message: 'User must be a valid object' })
  @IsNotEmpty({ message: 'User cannot be empty' })
  user: User;
}
