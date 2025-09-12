import { DeepPartial, FindManyOptions, Repository } from 'typeorm';

export abstract class BaseAbstractRepository<TEntity extends { id: string }> {
  protected constructor(protected readonly repo: Repository<TEntity>) {}

  public async findAll(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.repo.find(options);
  }

  public async findById(id: TEntity['id']): Promise<TEntity | null> {
    return this.repo.createQueryBuilder().where('id = :id', { id }).getOne();
  }

  public async create(partial: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = this.repo.create(partial);
    return this.repo.save(entity);
  }

  public async update(
    id: string,
    partial: DeepPartial<TEntity>,
  ): Promise<TEntity | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    Object.assign(entity, partial);

    return await this.repo.save(entity);
  }

  public async deleteById(id: string): Promise<TEntity | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    return await this.repo.remove(entity);
  }
}
