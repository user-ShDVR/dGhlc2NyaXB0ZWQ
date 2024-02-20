import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  email: string;

  @Column()
  hwid: string;

  @Column()
  product: string;

  @Column()
  purchaseDate: Date;
  
  @Column()
  activationDate: Date;
  
  @Column({ type: 'timestamp without time zone' })
  keyExpirationDate: Date;

  @Column()
  lastActive: Date;
}
