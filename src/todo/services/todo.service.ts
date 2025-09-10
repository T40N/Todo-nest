import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { IBaseService } from '../../common/domain/services/base.service';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoFactory } from '../factories/todo.factory';
import { TodoDto } from '../dtos/todo.dto';

@Injectable()
export class TodoService implements IBaseService<Todo, TodoDto> {
  constructor(
    private readonly todoRepository: TodoRepository,

    @Inject()
    private readonly todoFactory: TodoFactory,
  ) {}

  public async findAll(): Promise<TodoDto[]> {
    const foundTodos = await this.todoRepository.findAll();
    return foundTodos.map((todo) => {
      return this.todoFactory.toTodoDto(todo);
    });
  }

  public async findById(id: string): Promise<TodoDto> {
    const foundTodo = await this.todoRepository.findById(id);
    if (!foundTodo) {
      throw new NotFoundException(`Todo of id: ${id} not found`);
    }
    return this.todoFactory.toTodoDto(foundTodo);
  }

  public async findNonDoneTodos(): Promise<TodoDto[]> {
    const foundTodos = await this.todoRepository.findAllByStatus(false);
    return foundTodos.map((todo) => {
      return this.todoFactory.toTodoDto(todo);
    });
  }

  public async findDoneTodos(): Promise<TodoDto[]> {
    const foundTodos = await this.todoRepository.findAllByStatus(true);
    return foundTodos.map((todo) => {
      return this.todoFactory.toTodoDto(todo);
    });
  }

  public async create(create: CreateTodoDto): Promise<TodoDto> {
    const mappedTodo = this.todoFactory.fromCreateDto(create);

    const createdTodo = await this.todoRepository.create(mappedTodo);

    return this.todoFactory.toTodoDto(createdTodo);
  }

  public async update(id: string, update: UpdateTodoDto): Promise<TodoDto> {
    const mappedTodo = this.todoFactory.fromUpdateDto(update);

    const updatedTodo = await this.todoRepository.update(id, mappedTodo);

    if (!updatedTodo) {
      throw new NotFoundException(`Todo of id: ${id} not found`);
    }

    return this.todoFactory.toTodoDto(updatedTodo);
  }

  public async deleteById(id: string): Promise<void> {
    const deletedTodo = await this.todoRepository.deleteById(id);
    if (!deletedTodo) {
      throw new NotFoundException(`Todo of id: ${id} not found`);
    }
  }
}
