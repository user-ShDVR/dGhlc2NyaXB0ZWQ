import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  hwid: string;

  @Column()
  product: string;

  @Column()
  purchaseDate: Date;
  
  @Column()
  activationDate: Date;

  @Column()
  lastActive: Date;
}
