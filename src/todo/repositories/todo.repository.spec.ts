import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoRepository } from './todo.repository';
import { Todo } from '../entities/todo.entity';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;
  let ormRepo: jest.Mocked<Repository<Todo>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoRepository,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    todoRepository = module.get<TodoRepository>(TodoRepository);
    ormRepo = module.get(getRepositoryToken(Todo));
  });

  it('for status true should return all true status todos', async () => {
    const todosTrue = [{ id: '1', title: 'X', status: true } as Todo];

    ormRepo.find.mockResolvedValue(todosTrue);

    const result = await todoRepository.findAllByStatus(true);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(ormRepo.find as jest.Mock).toHaveBeenCalledWith({
      where: { status: true },
    });
    expect(result).toEqual(todosTrue);
  });

  it('for status false should return all false status todos', async () => {
    const todosFalse = [{ id: '1', title: 'X', status: false } as Todo];

    ormRepo.find.mockResolvedValue(todosFalse);

    const result = await todoRepository.findAllByStatus(false);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(ormRepo.find as jest.Mock).toHaveBeenCalledWith({
      where: { status: false },
    });
    expect(result).toEqual(todosFalse);
  });
});
