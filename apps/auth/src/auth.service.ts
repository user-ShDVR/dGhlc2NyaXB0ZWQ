import {
  ConflictException,
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import {
  UserEntity,
  UserRepositoryInterface,
} from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }
  async getCheatnameUsers(cheatName: string): Promise<UserEntity[]> {
    return await this.usersRepository.getCheatnameUsers(cheatName);
  }
  
}
