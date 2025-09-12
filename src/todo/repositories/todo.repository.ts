import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../base';
import { Todo } from '../entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoRepository extends BaseAbstractRepository<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {
    super(todoRepository);
  }

  public async findAllByStatus(status: boolean): Promise<Todo[]> {
    return await this.todoRepository.find({
      where: {
        status,
      },
    });
  }
}
