import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_statistic')
export class UserStatisticEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  totalRuntime: number; // [ShDVR]: #Note / общее время работы приложения в минутах

  @Column()
  firstRunDate: Date;  // [ShDVR]: #Note / дата первого запуска приложения

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
  
}
