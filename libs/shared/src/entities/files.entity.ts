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
  id: number; // [ShDVR]: #Note / ID

  @Column({ unique: true })
  filename: string; // [ShDVR]: #Note / Уникальное имя приложения которое генерируем при получении файла

  @Column()
  originalName: string; // [ShDVR]: #Note / Имя приложения которое было изначально при загрузке на сервер

  @Column()
  version: string; // [ShDVR]: #Note / Версия приложения

  @Column({ unique: true })
  product: string; // [ShDVR]: #Note / Имя продукта от которого само приложение

  @Column()
  size: number; // [ShDVR]: #Note / Размер приложения

  @Column()
  mimetype: string; // [ShDVR]: #Note / Тип приложения

  @Column()
  uploadDate: Date; // [ShDVR]: #Note / Дата загрузки
}
