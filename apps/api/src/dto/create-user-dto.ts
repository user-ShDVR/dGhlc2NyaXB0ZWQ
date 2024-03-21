import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'contact@hugerain.net' })
  @IsString()
  @IsEmail()
  email: string;
}
