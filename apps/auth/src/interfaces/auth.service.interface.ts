import { UserEntity } from '@app/shared';
import { ExistingUserDTO } from '../dtos/existing-user.dto';

import { NewUserDTO } from '../dtos/new-user.dto';

export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>;
}
