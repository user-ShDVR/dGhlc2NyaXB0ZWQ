import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetActiveUserDto {
  @ApiProperty({ example: '461b7ffbc497a4f0802cc5c1d9a26fb2' })
  @IsString()
  hwid: string;
  @ApiProperty({ example: 'Ln1yD3m3fBC2v0Nf' })
  @IsString()
  key: string;
}
