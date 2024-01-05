import { UserEntity, UserRepositoryInterface, UserStatisticRepositoryInterface } from '@app/shared';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  async setActiveUser(product: string, hwid: string) {
    const currentTime = new Date();
    const updatedActivity = await this.usersRepository.setActiveUser(
      hwid,
      product,
      { lastActive: currentTime },
    );
  
    if (updatedActivity.affected === 1) {
      const user = await this.usersRepository.findByConditionWithoutFail({
        where: { product, hwid },
      });
  
      if (user) {
        const userStatistic = await this.userStatisticRepository.findByConditionWithoutFail({
          where: { user: user },
        });
  
        if (userStatistic) {
          userStatistic.totalRuntime += 1;
          await this.userStatisticRepository.save(userStatistic);
        } else {
          const newStatistic = this.userStatisticRepository.create({
            totalRuntime: 1,
            user: user,
          });
  
          await this.userStatisticRepository.save(newStatistic);
        }
  
        return 'Active status updated';
      } else {
        // Обработка ошибки, если пользователь не найден
        throw new NotFoundException('User not found');
      }
    } else if (updatedActivity.affected === 0) {
      return await this.createUser(product, hwid);
    }
  }
  async createUser(product: string, hwid: string): Promise<UserEntity> {
    
    const res = await this.usersRepository.findByConditionWithoutFail({
      where: { product: product, hwid: hwid },
    });

    if (res) {
      throw new ConflictException();
    } else {
      const currentTime = new Date();
      const newUser = await this.usersRepository.save({product, hwid, lastActive: currentTime, activationDate: currentTime, email: 'noemail.com', key: '123123', purchaseDate: currentTime  });
      const userStatistic = await this.userStatisticRepository.findByConditionWithoutFail({
        where: { user: newUser },
      });
  
      // Если записи нет, создаем новую и устанавливаем firstRunDate
      if (!userStatistic) {
        const newStatistic = this.userStatisticRepository.create({
          firstRunDate: currentTime,
          user: newUser,
        });
  
        await this.userStatisticRepository.save(newStatistic);
      }
      return newUser
    }
  }
}
