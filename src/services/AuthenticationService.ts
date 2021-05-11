import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/UserRepository';

import User from '../models/User';
import {classToClass} from 'class-transformer';
import IRegisterDTO from '../mappers/IRegisterDTO';

import SessionService from './SessionService';

export default class AuthenticationService {
  private sessionService = new SessionService();

  async login(email: string, password: string) {
    if (email === "" || password === "") return false;

    const userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findByEmail(email);
    if (!user) return false;


    if (user.authenticate(password)) {
      const {accessToken, refreshToken} = await this.sessionService.generateTokens(user);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      return classToClass(user);
    } else {
      return false;
    }
  }

  async register(params: IRegisterDTO) {
    let user = new User(params)
    user.getPasswordEncrypted(true)
    const userRepository = getCustomRepository(UserRepository);
    let {id} = await userRepository.register(user)
    const {accessToken, refreshToken} = await this.sessionService.generateTokens(user);
    return {id, accessToken, refreshToken}
  }
}
