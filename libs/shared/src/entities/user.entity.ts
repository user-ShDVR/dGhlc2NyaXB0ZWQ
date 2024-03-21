import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  hwid: string;

  @Column()
  product: string;

  @Column()
  purchaseDate: Date;

  @Column({ nullable: true })
  activationDate: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  keyExpirationDate: Date;

  @Column({ nullable: true })
  lastActive: Date;
}
