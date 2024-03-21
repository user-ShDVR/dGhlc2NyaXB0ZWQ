import { BaseInterfaceRepository } from '@app/shared';

import { UserEntity } from '../entities/user.entity';
import { DeepPartial, UpdateResult } from 'typeorm';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {
  getCheatnameUsers(cheatName: string): Promise<UserEntity[]>;
  setActiveUser(
    hwid: string,
    cheatName: string,
    data: DeepPartial<UserEntity>,
  ): Promise<UpdateResult>;
  findByProductAndEmail(
    product: string,
    email: string,
  ): Promise<UserEntity | null>;
}
