// src/common/base.service.ts
import { BaseEntity, DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<
  TEntity extends BaseEntity & { id: string },
  TCreateDto = DeepPartial<TEntity>,
  TUpdateDto = DeepPartial<TEntity>,
> {
  constructor(protected readonly repo: Repository<TEntity>) {}

  protected async findAll(
    options?: FindManyOptions<TEntity>,
  ): Promise<TEntity[]> {
    return this.repo.find(options);
  }

  protected async findById(id: TEntity['id']): Promise<TEntity | null> {
    return this.repo.createQueryBuilder().where('id = :id', { id }).getOne();
  }

  protected async create(dto: TCreateDto): Promise<TEntity> {
    const entity = this.repo.create(dto as DeepPartial<TEntity>);
    return this.repo.save(entity);
  }

  protected async update(id: string, dto: TUpdateDto): Promise<TEntity> {
    await this.repo.update(
      id,
      dto as unknown as QueryDeepPartialEntity<TEntity>,
    );
    return (await this.findById(id)) as TEntity;
  }

  protected async deleteById(id: string): Promise<TEntity | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    return await this.repo.remove(entity);
  }
}
