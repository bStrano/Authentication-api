import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';

@Entity('refreshTokens')
export class RefreshTokens extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column()
  code: string;
  @Column()
  expiryAt: Date;
  @Column()
  userId: number;
  @Column()
  platform: PlatformEnum;
  user?: User;

  constructor(props: Partial<RefreshTokens>) {
    super();
    if (props) {
      this.id = props.id;
      this.code = props.code;
      this.platform = props.platform;
      this.expiryAt = props.expiryAt;
      this.userId = props.userId;
      this.user = props.user;
    }
  }
}
