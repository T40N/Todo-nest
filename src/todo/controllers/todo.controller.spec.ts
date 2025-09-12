import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { TodoController } from './todo.controller';
import { TodoService } from '../services/todo.service';
import { TodoDto } from '../dtos/todo.dto';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';

// Build a sample TodoDto
const makeDto = (overrides: Partial<TodoDto> = {}): TodoDto =>
  ({
    id: overrides.id ?? uuidv4(),
    title: overrides.title ?? 'Sample',
    description: overrides.description ?? 'Desc',
    status: overrides.status ?? false,
    date: overrides.date ?? new Date('2025-01-01T00:00:00.000Z'),
  }) as TodoDto;

describe('TodoController', () => {
  let controller: TodoController;
  let service: jest.Mocked<TodoService>;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllDone: jest.fn(),
      findAllNotDone: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('returns all todos', async () => {
      const items = [makeDto(), makeDto()];
      service.findAll.mockResolvedValue(items);

      const findAllSpy = jest.spyOn(service, 'findAll');

      await expect(controller.getAll()).resolves.toEqual(items);
      expect(findAllSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOne', () => {
    it('returns a todo by id', async () => {
      const id = uuidv4();
      const dto = makeDto({ id });
      service.findById.mockResolvedValue(dto);

      const findByIdSpy = jest.spyOn(service, 'findById');

      await expect(controller.getOne(id)).resolves.toEqual(dto);
      expect(findByIdSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('findAllByStatus', () => {
    it('delegates to findAllDone when status=true', async () => {
      const items = [makeDto({ status: true })];
      service.findAllDone.mockResolvedValue(items);

      const findAllDoneSpy = jest.spyOn(service, 'findAllDone');
      const findAllNotDoneSpy = jest.spyOn(service, 'findAllNotDone');

      await expect(controller.findAllByStatus(true)).resolves.toEqual(items);

      expect(findAllDoneSpy).toHaveBeenCalledTimes(1);
      expect(findAllNotDoneSpy).not.toHaveBeenCalled();
    });

    it('delegates to findAllNotDone when status=false', async () => {
      const items = [makeDto({ status: false })];
      service.findAllNotDone.mockResolvedValue(items);

      const findAllDoneSpy = jest.spyOn(service, 'findAllDone');
      const findAllNotDoneSpy = jest.spyOn(service, 'findAllNotDone');

      await expect(controller.findAllByStatus(false)).resolves.toEqual(items);

      expect(findAllNotDoneSpy).toHaveBeenCalledTimes(1);
      expect(findAllDoneSpy).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('creates a todo', async () => {
      const createDto: CreateTodoDto = {
        title: 'Buy milk',
        description: '2% lactose free',
        date: new Date('2025-04-20T10:00:00.000Z'),
      };
      const created = makeDto({
        title: createDto.title,
        description: createDto.description,
        date: createDto.date,
      });
      service.create.mockResolvedValue(created);

      const createSpy = jest.spyOn(service, 'create');

      await expect(controller.create(createDto)).resolves.toEqual(created);
      expect(createSpy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('updates a todo', async () => {
      const id = uuidv4();
      const updateDto: UpdateTodoDto = {
        title: 'New title',
        status: true,
      };
      const updated = makeDto({ id, title: 'New title', status: true });
      service.update.mockResolvedValue(updated);

      const updateSpy = jest.spyOn(service, 'update');

      await expect(controller.update(id, updateDto)).resolves.toEqual(updated);
      expect(updateSpy).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('delete', () => {
    it('deletes by id', async () => {
      const id = uuidv4();
      service.deleteById.mockResolvedValue(undefined);

      const deleteSpy = jest.spyOn(service, 'deleteById');

      await expect(controller.delete(id)).resolves.toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith(id);
    });
  });
});
