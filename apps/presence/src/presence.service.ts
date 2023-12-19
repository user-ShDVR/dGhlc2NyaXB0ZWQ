import { UserEntity, UserRepositoryInterface } from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';

@Injectable()
export class PresenceService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
  ) {}

  async getActiveUsers(product: string) {
    const users = await this.usersRepository.getCheatnameUsers(product);
    const currentTime = new Date();
    const onlineUsersCount = users.reduce((count, user) => {
      const lastActiveTime = new Date(user.lastActive);
      const secondsSinceLastActive =
        (currentTime.getTime() - lastActiveTime.getTime()) / 1000;
      if (secondsSinceLastActive <= 120) {
        return count + 1;
      }
      return count;
    }, 0);

    return onlineUsersCount;
  }
  async setActiveUser(product: string, hwid: string) {
    const currentTime = new Date();
    const updatedActivity = await this.usersRepository.setActiveUser(
      hwid,
      product,
      { lastActive: currentTime },
    );
    if (updatedActivity.affected === 1) {
      return 'Active status updated';
    } else if (updatedActivity.affected === 0) {
      throw new NotFoundException(
        `User with hwid ${hwid} not found in product users (${product})`,
      );
    }
  }
}
