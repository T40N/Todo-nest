import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { TodoDto } from '../dtos/todo.dto';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  public async getAll(): Promise<TodoDto[]> {
    return await this.todoService.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: string): Promise<TodoDto> {
    return await this.todoService.findById(id);
  }

  @Get('/status')
  public async findAllByStatus(
    @Query('status', ParseBoolPipe) status: boolean,
  ): Promise<TodoDto[]> {
    if (status) {
      return await this.todoService.findAllDone();
    }
    return await this.todoService.findAllNotDone();
  }

  @Post()
  public async create(@Body() createTodoDto: CreateTodoDto): Promise<TodoDto> {
    return await this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoDto> {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.todoService.deleteById(id);
  }
}
