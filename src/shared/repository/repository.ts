export interface Repository<T> {
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  deleteById(id: string): Promise<void>;
}
