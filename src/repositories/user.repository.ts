import { BaseRepository } from './base.repository'
import { User } from '../models/userModel';

export class UserRepository extends BaseRepository<User> {
  constructor () {
    super('users')
  }

  search (search: string): Promise<User[]> {
    return this.qb.where('name', 'like', `%${String(search)}%`).select('*')
  }

  getAllUsers (): Promise<User[]> {
    return this.qb.select('id', 'email', 'name')
  }
}
