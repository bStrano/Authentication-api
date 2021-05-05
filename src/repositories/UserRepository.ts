import {EntityRepository, Repository} from 'typeorm';
import User from '../models/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  /**
   *  Check if email exists and if exists return the user
   * @param {string} email
   * @returns {Promise<User>}
   */
  async findByEmail(email: string){
    return this.findOne({email})
  }

  /**
   * Register UserAuthenticated
   */
  async register(user: User){
    return this.save(user)
  }
}
