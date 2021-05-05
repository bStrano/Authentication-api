import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {classToClass} from 'class-transformer';

export default class UserService {
  static async login(email: string, password: string) {
    console.log(email, password)
    const userUnauthenticated = new User(email, password, '');
    console.log(userUnauthenticated)
    if (email === "" || password === "") throw new Error("Invalid credentials")

    const userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findByEmail(email);
    if (!user) return null;


    if (user.authenticate(password)) {
      user.accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);
      return classToClass(user);
    } else {
      throw new Error("Invalid credentials")
    }
  }

  static async register(name: string, email: string, password: string) {
    let user = new User(email, password, name)
    user.getPasswordEncrypted(true)
    console.log(user)
    const userRepository = getCustomRepository(UserRepository);
    return await userRepository.register(user)
  }
}
