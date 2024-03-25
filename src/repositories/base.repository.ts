import { Knex } from 'knex'

import db from '../database/connection'

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  public readonly knex: Knex = db

  constructor (public readonly tableName: string) {
    console.log('KnexRepository: ', tableName)
  }

  public get qb (): Knex.QueryBuilder {
    return this.knex<T>(this.tableName)
  }

  find (item: Partial<T>): Promise<T[]> {
    return this.qb.where(item).select()
  }

  getById (id: number): Promise<T> {
    return this.qb.where({ id }).select().first()
  }

  getAll (): Promise<T[]> {
    return this.qb.select('*')
  }

  create (date: Omit<T, 'id'>): Promise<number[]> {
    return this.qb.insert(date)
  }

  delete (id: number): Promise<void> {
    return this.qb.where('id', id).delete()
  }

  update (id: number, date: Partial<T>): Promise<void> {
    return this.qb.where('id', id).update(date)
  }
}
