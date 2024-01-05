import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { UserStatisticRepositoryInterface } from '../interfaces/usersStats.repository.interface';
import { UserStatisticEntity } from '../entities/userStatistic.entity';

@Injectable()
export class UserStatisticRepository
  extends BaseAbstractRepository<UserStatisticEntity>
  implements UserStatisticRepositoryInterface
{
  constructor(
    @InjectRepository(UserStatisticEntity)
    private readonly userStatisticRepository: Repository<UserStatisticEntity>,
  ) {
    super(userStatisticRepository);
  }

}