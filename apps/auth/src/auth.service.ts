import {
  ConflictException,
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { UserEntity, UserRepositoryInterface } from '@app/shared';

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
  async generateKey(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async createUser(product: string, hwid: string): Promise<UserEntity> {
    const res = await this.usersRepository.findByConditionWithoutFail({
      where: { product: product, hwid: hwid },
    });
    console.log(res);
    if (res) {
      throw new ConflictException();
    } else {
      const currentTime = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(currentTime.getDate() + 30); 
      const key = await this.generateKey(16);
      return await this.usersRepository.save({
        product,
        hwid,
        lastActive: currentTime,
        activationDate: currentTime,
        email: 'noemail.com',
        key: key,
        keyExpirationDate: expirationDate,
        purchaseDate: currentTime,
      });
    }
  }
}
