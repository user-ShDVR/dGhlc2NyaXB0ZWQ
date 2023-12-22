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
  async createUser(product: string, hwid: string): Promise<UserEntity> {
    
    const res = await this.usersRepository.findByConditionWithoutFail({
      where: { product: product, hwid: hwid },
    });
    console.log(res)
    if (res) {
      throw new ConflictException();
    } else {
      const currentTime = new Date();
      return await this.usersRepository.save({product, hwid, lastActive: currentTime, activationDate: currentTime, email: 'noemail.com', key: '123123', purchaseDate: currentTime  });
    }
  }
   
}
