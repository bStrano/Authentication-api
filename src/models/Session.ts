import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn, VersionColumn} from 'typeorm';
import User from './User';


@Entity('sessions')
export default class Session {
  @Column()
  token: string
  @OneToOne(() => User, {primary: true})
  @JoinColumn({name: 'user_id'})
  user: User
  @CreateDateColumn({ name: 'created_at', type: "timestamp" })
  createAt?: Date
  @UpdateDateColumn({name: 'updated_at', type: "timestamp"})
  updatedAt?: Date
  @VersionColumn({name: 'version', type: "timestamp"})
  version: number = 0;


  constructor(props: Omit<Session,`version`>) {
    this.token = props?.token;
    this.user = props?.user;
  }
}
