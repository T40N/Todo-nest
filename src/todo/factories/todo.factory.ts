import { Injectable } from '@nestjs/common';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoDto } from '../dtos/todo.dto';
import { DeepPartial } from 'typeorm';

@Injectable()
export class TodoFactory {
  public toTodoDto(entity: Todo): TodoDto {
    return new TodoDto({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      date: entity.date,
    });
  }

  public fromCreateDto(dto: CreateTodoDto): DeepPartial<Todo> {
    return {
      title: dto.title.trim(),
      description: dto.description?.trim(),
      status: false,
      date: dto.date ?? null,
    };
  }

  public fromUpdateDto(dto: UpdateTodoDto): DeepPartial<Todo> {
    return {
      ...dto,
    };
  }
}
