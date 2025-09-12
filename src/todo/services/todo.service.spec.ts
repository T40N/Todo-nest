import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TodoRepository } from '../repositories/todo.repository';
import { TodoFactory } from '../factories/todo.factory';
import { Todo } from '../entities/todo.entity';
import { TodoDto } from '../dtos/todo.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { DeepPartial } from 'typeorm';

describe('TodoService', () => {
  let service: TodoService;
  let repo: jest.Mocked<TodoRepository>;
  let factory: jest.Mocked<TodoFactory>;

  const now = new Date();
  const randomDate = new Date(Math.floor(Math.random() * Date.now()));

  const entityA: Todo = {
    id: 'uuid-a',
    title: 'A',
    description: 'desc A',
    status: false,
    date: randomDate,
    createdAt: now,
  } as unknown as Todo;

  const entityB: Todo = {
    id: 'uuid-b',
    title: 'B',
    description: 'desc B',
    status: true,
    date: randomDate,
    createdAt: now,
  } as unknown as Todo;

  const dtoA: TodoDto = {
    id: 'uuid-a',
    title: 'A',
    description: 'desc A',
    status: false,
    date: randomDate,
  };

  const dtoB: TodoDto = {
    id: 'uuid-b',
    title: 'B',
    description: 'desc B',
    status: true,
    date: randomDate,
  };

  beforeEach(async () => {
    const repoMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllByStatus: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    };

    const factoryMock = {
      toTodoDto: jest.fn(),
      fromCreateDto: jest.fn(),
      fromUpdateDto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: TodoRepository, useValue: repoMock },
        { provide: TodoFactory, useValue: factoryMock },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repo = module.get(TodoRepository);
    factory = module.get(TodoFactory);
  });

  describe('findAll', () => {
    it('returns all todos', async () => {
      repo.findAll.mockResolvedValue([entityA, entityB]);
      factory.toTodoDto.mockImplementation((e: Todo) =>
        e.id === 'uuid-a' ? dtoA : dtoB,
      );

      const findAllSpy = jest.spyOn(repo, 'findAll');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalledTimes(1);
      expect(toTodoDtoSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual([dtoA, dtoB]);
    });

    it('returns empty list if not todos saved', async () => {
      repo.findAll.mockResolvedValue([]);
      factory.toTodoDto.mockImplementation((e: Todo) =>
        e.id === 'uuid-a' ? dtoA : dtoB,
      );

      const findAllSpy = jest.spyOn(repo, 'findAll');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalledTimes(1);
      expect(toTodoDtoSpy).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns TodoDto for existing todo', async () => {
      repo.findById.mockResolvedValue(entityA);
      factory.toTodoDto.mockReturnValue(dtoA);

      const findByIdSpy = jest.spyOn(repo, 'findById');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.findById('uuid-a');

      expect(findByIdSpy).toHaveBeenCalledWith('uuid-a');
      expect(toTodoDtoSpy).toHaveBeenCalledWith(entityA);
      expect(result).toEqual(dtoA);
    });

    it('throws NotFoundException for non existing todo', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findById('nope')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findAllNotDone', () => {
    it('returns all not done todos as TodoDto list', async () => {
      repo.findAllByStatus.mockResolvedValue([entityA]);
      factory.toTodoDto.mockReturnValue(dtoA);

      const findAllByStatus = jest.spyOn(repo, 'findAllByStatus');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.findAllNotDone();

      expect(findAllByStatus).toHaveBeenCalledWith(false);
      expect(toTodoDtoSpy).toHaveBeenCalledWith(entityA);
      expect(result).toEqual([dtoA]);
    });

    it('returns empty list if no saved false status todos', async () => {
      repo.findAllByStatus.mockResolvedValue([]);
      factory.toTodoDto.mockReturnValue(dtoA);

      const findAllByStatus = jest.spyOn(repo, 'findAllByStatus');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.findAllNotDone();
      expect(findAllByStatus).toHaveBeenCalledWith(false);
      expect(toTodoDtoSpy).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findDoneTodos', () => {
    it('returns all done todos as TodoDto list', async () => {
      repo.findAllByStatus.mockResolvedValue([entityB]);
      factory.toTodoDto.mockReturnValue(dtoB);

      const result = await service.findAllDone();

      const findAllByStatus = jest.spyOn(repo, 'findAllByStatus');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      expect(findAllByStatus).toHaveBeenCalledWith(true);
      expect(toTodoDtoSpy).toHaveBeenCalledWith(entityB);
      expect(result).toEqual([dtoB]);
    });

    it('returns empty list if no saved true status todos', async () => {
      repo.findAllByStatus.mockResolvedValue([]);
      factory.toTodoDto.mockReturnValue(dtoB);

      const findAllByStatus = jest.spyOn(repo, 'findAllByStatus');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.findAllDone();
      expect(findAllByStatus).toHaveBeenCalledWith(true);
      expect(toTodoDtoSpy).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates todo and returns TodoDTo', async () => {
      const createDto: CreateTodoDto = {
        title: 'A',
        description: 'desc A',
        date: randomDate,
      };
      const partial: DeepPartial<Todo> = { ...createDto, status: false };

      factory.fromCreateDto.mockReturnValue(partial);
      repo.create.mockResolvedValue(entityA);
      factory.toTodoDto.mockReturnValue(dtoA);

      const result = await service.create(createDto);

      const fromCreateDtoSpy = jest.spyOn(factory, 'fromCreateDto');
      const createSpy = jest.spyOn(repo, 'create');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      expect(fromCreateDtoSpy).toHaveBeenCalledWith(createDto);
      expect(createSpy).toHaveBeenCalledWith(partial);
      expect(toTodoDtoSpy).toHaveBeenCalledWith(entityA);
      expect(result).toEqual(dtoA);
    });
  });

  describe('update', () => {
    it('updates and returns correct TodoDto', async () => {
      const updateDto: UpdateTodoDto = { title: 'X' };
      const partial = { title: 'X' };
      factory.fromUpdateDto.mockReturnValue(partial);
      repo.update.mockResolvedValue({
        ...partial,
        ...entityB,
      });
      factory.toTodoDto.mockReturnValue({
        ...partial,
        ...dtoB,
      });

      const fromUpdateDtoSpy = jest.spyOn(factory, 'fromUpdateDto');
      const updateSpy = jest.spyOn(repo, 'update');
      const toTodoDtoSpy = jest.spyOn(factory, 'toTodoDto');

      const result = await service.update('uuid-b', updateDto);

      expect(fromUpdateDtoSpy).toHaveBeenCalledWith(updateDto);
      expect(updateSpy).toHaveBeenCalledWith('uuid-b', partial);
      expect(toTodoDtoSpy).toHaveBeenCalledWith(entityB);
      expect(result).toEqual(dtoB);
    });

    it('throws NotFoundException when no todo of provided id found', async () => {
      factory.fromUpdateDto.mockReturnValue({ title: 'X' });
      repo.update.mockResolvedValue(null);

      await expect(
        service.update('missing', { title: 'X' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('deletes existing todo', async () => {
      repo.deleteById.mockResolvedValue(entityA);

      const deleteByIdSpy = jest.spyOn(repo, 'deleteById');

      await expect(service.deleteById('uuid-a')).resolves.toBeUndefined();
      expect(deleteByIdSpy).toHaveBeenCalledWith('uuid-a');
    });

    it('throws NotFoundException when todo with provided id does not exist', async () => {
      repo.deleteById.mockResolvedValue(null);
      await expect(service.deleteById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
