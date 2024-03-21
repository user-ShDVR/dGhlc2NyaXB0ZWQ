import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { UserRepositoryInterface } from '../interfaces/users.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository
  extends BaseAbstractRepository<UserEntity>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  public async getCheatnameUsers(product: string): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: {
        product: product,
      },
    });
  }

  public async setActiveUser(
    hwid: string,
    product: string,
    data: DeepPartial<UserEntity>,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(
      { hwid: hwid, product: product },
      data,
    );
  }
  async findByProductAndEmail(
    product: string,
    email: string,
  ): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ where: { product, email } });
    } catch (error) {
      console.error(
        'Error occurred while finding user by product and email:',
        error,
      );
      return null;
    }
  }
}
