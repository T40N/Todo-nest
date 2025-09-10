import { Module } from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { TodoRepository } from './repositories/todo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoFactory } from './factories/todo.factory';
import { TodoController } from './controllers/todo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, TodoService, TodoFactory],
})
export class TodoModule {}
