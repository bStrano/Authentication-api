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
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true, name: 'google_id' })
  googleId: string;
  @Column({ nullable: true, name: 'profile_picture' })
  profilePicture: string;
}
