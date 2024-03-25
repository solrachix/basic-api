interface IBaseRepository<T> {
  find(item: Partial<T>): Promise<T[]>
  getById(id: number): Promise<T>
  getAll(): Promise<T[]>
  create(item: Omit<T, 'id'>): Promise<number[]>
  delete(id: number): Promise<void>
  update(id: number, date: Partial<T>): Promise<void>
}
