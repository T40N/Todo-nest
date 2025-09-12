import { DeepPartial } from 'typeorm';

export interface IBaseService<TEntity extends { id: string }, ReturnDto> {
  findById(id: string): Promise<ReturnDto>;
  findAll(): Promise<ReturnDto[]>;
  create(create: DeepPartial<TEntity>): Promise<ReturnDto>;
  update(id: string, update: DeepPartial<TEntity>): Promise<ReturnDto>;
  deleteById(id: string): Promise<void>;
}
