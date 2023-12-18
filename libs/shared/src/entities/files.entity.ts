import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  filename: string;

  @Column()
  originalName: string;

  @Column()
  version: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column()
  uploadDate: Date;
}
