import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  lastName: string;
  @Column()
  password: string;
}
