import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {classToClass} from 'class-transformer';
import IRegisterDTO from '../mappers/IRegisterDTO';

export default class UserService {
  static async login(email: string, password: string) {
    if (email === "" || password === "") throw new Error("Invalid credentials")

    const userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findByEmail(email);
    if (!user) return false;


    if (user.authenticate(password)) {
      user.accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);
      return classToClass(user);
    } else {
      return false;
    }
  }

  static async register(params: IRegisterDTO) {
    let user = new User(params.email, params.password, params.name)
    user.getPasswordEncrypted(true)
    const userRepository = getCustomRepository(UserRepository);
    return await userRepository.register(user)
  }
}
