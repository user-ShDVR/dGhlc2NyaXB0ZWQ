import { BaseInterfaceRepository } from '@app/shared';
import { UserStatisticEntity } from '../entities/userStatistic.entity';

export interface UserStatisticRepositoryInterface
  extends BaseInterfaceRepository<UserStatisticEntity> {}
