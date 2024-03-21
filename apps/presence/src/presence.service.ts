import {
  UserEntity,
  UserRepositoryInterface,
  UserStatisticRepositoryInterface,
} from '@app/shared';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PresenceService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('UserStatisticRepositoryInterface')
    private readonly userStatisticRepository: UserStatisticRepositoryInterface,
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

    return { onlineUsersCount };
  }

  async setActiveUser(product: string, hwid: string, key: string) {
    const user = await this.usersRepository.findByConditionWithoutFail({
      where: { product: product, key: key },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.keyExpirationDate > new Date() || user.keyExpirationDate == null) {
      const currentTime = new Date();
      if (user.keyExpirationDate == null) {
        const expirationDate = new Date();
        expirationDate.setDate(currentTime.getDate() + 30);
        Object.assign(user, {
          lastActive: currentTime,
          activationDate: currentTime,
          keyExpirationDate: expirationDate,
          hwid,
        });
        const updatedActivity = await this.usersRepository.save(user);
      } else {
        Object.assign(user, {
          lastActive: currentTime,
          hwid,
        });
        const updatedActivity = await this.usersRepository.save(user);
      }

      const userStatistic =
        await this.userStatisticRepository.findByConditionWithoutFail({
          where: { user: user },
        });

      if (userStatistic) {
        userStatistic.totalRuntime += 1;
        await this.userStatisticRepository.save(userStatistic);
      } else {
        const newStatistic = this.userStatisticRepository.create({
          totalRuntime: 1,
          firstRunDate: currentTime,
          user: user,
        });

        await this.userStatisticRepository.save(newStatistic);
      }
      return 'Active status updated';
    } else {
      throw new UnauthorizedException('Your key is expired');
    }
  }
}
