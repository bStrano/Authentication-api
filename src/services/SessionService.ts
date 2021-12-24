import User from '../models/User';
import jwt from 'jsonwebtoken';
import {SessionRepository} from '../repositories/SessionRepository';
import {getCustomRepository} from 'typeorm';
import IRestoreSessionDTO from '../mappers/IRestoreSessionDTO';
import ERRORS from '../../constants/ERRORS';
import IRemoveSessionDTO from '../mappers/IRemoveSessionDTO';

export default class SessionService {
  private readonly getRepository = () => getCustomRepository(SessionRepository);

  constructor() {
  }

  generateAccessToken(user: User) {
    // TODO: increase token time
    return jwt.sign({id: user.id, name: user.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '300s'});
  }

  generateRefreshToken(user: User) {
    return jwt.sign({id: user.id, name: user.name}, process.env.REFRESH_TOKEN_SECRET);
  }

  async verifyRefreshToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) reject(new Error(ERRORS.SESSION.INVALID_TOKEN));
        // @ts-ignore
        const accessToken = this.generateAccessToken(user);
        resolve(accessToken);
      });
    })

  }

  async generateTokens(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await this.getRepository().register(user, refreshToken)
    return {accessToken, refreshToken};
  }

  async restoreSession({token}: IRestoreSessionDTO) {
    let refreshToken = await this.getRepository().findByRefreshToken({token});
    if (!refreshToken) {
      throw new Error(ERRORS.SESSION.INVALID_TOKEN)
    }
    return this.verifyRefreshToken(token);
  }

  async removeSession({user}: IRemoveSessionDTO): Promise<void> {
    return await this.getRepository().deleteByUser({user})
  }
}



