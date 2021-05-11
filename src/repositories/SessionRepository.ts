import {EntityRepository, Repository} from 'typeorm';

import User from '../models/User';
import Session from '../models/Session';
import IRestoreSessionDTO from '../mappers/IRestoreSessionDTO';
import IRemoveSessionDTO from '../mappers/IRemoveSessionDTO';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {


  async register(user: User, refreshToken: string) {
    let session = new Session({user, token: refreshToken});
    return this.save(session);
  }

  async findByRefreshToken({token}: IRestoreSessionDTO) {
    return this.findOne({token})
  }

  async deleteByUser({user}: IRemoveSessionDTO) {
     await this.delete({
      user: {
        id: user
      }
    })
  }
}
