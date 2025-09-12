import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { TodoFactory } from './todo.factory';
import { Todo } from '../entities/todo.entity';
import { TodoDto } from '../dtos/todo.dto';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';

const makeEntity = (overrides: Partial<Todo> = {}): Todo =>
  ({
    id: overrides.id,
    title: overrides.title ?? 'Sample',
    description: overrides.description ?? 'Desc',
    status: overrides.status ?? false,
    date: overrides.date ?? new Date('2025-01-01T00:00:00.000Z'),
  }) as unknown as Todo;

describe('TodoFactory', () => {
  let factory: TodoFactory;
  let moduleRef: TestingModule;
  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [TodoFactory],
    }).compile();
    factory = moduleRef.get(TodoFactory);
  });

  describe('toTodoDto', () => {
    it('maps a Todo entity to TodoDto', () => {
      const id = uuidv4();
      const entity = makeEntity({
        id: id,
        title: 'Title',
        description: 'Some description',
        status: true,
        date: new Date('2025-03-15T12:34:56.000Z'),
      });

      const dto = factory.toTodoDto(entity);

      // Ensure it is actually a TodoDto instance
      expect(dto).toBeInstanceOf(TodoDto);
      expect(dto).toEqual({
        id: id,
        title: 'Title',
        description: 'Some description',
        status: true,
        date: new Date('2025-03-15T12:34:56.000Z'),
      });
      expect(uuidValidate(dto.id)).toBe(true);
    });
  });

  describe('fromCreateDto', () => {
    it('trims title and description, sets default status=false, and uses provided date', () => {
      const createDto: CreateTodoDto = {
        title: '  Buy milk  ',
        description: '  2% lactose free  ',
        date: new Date('2025-04-20T10:00:00.000Z'),
      } as unknown as CreateTodoDto;

      const partial = factory.fromCreateDto(createDto);

      expect(partial).toEqual({
        title: 'Buy milk',
        description: '2% lactose free',
        status: false,
        date: new Date('2025-04-20T10:00:00.000Z'),
      });
    });

    it('handles optional description and sets date to null when not provided', () => {
      const createDto: CreateTodoDto = {
        title: '  Clean room  ',
        // description omitted on purpose
        // date omitted on purpose
      } as unknown as CreateTodoDto;

      const partial = factory.fromCreateDto(createDto);

      expect(partial).toEqual({
        title: 'Clean room',
        description: undefined,
        status: false,
        date: null,
      });
    });
  });

  describe('fromUpdateDto', () => {
    it('returns a shallow copy of UpdateTodoDto (spread)', () => {
      const updateDto: UpdateTodoDto = {
        title: 'New title',
        description: 'New description',
        status: true,
        date: new Date('2025-06-01T08:00:00.000Z'),
      } as unknown as UpdateTodoDto;

      const partial = factory.fromUpdateDto(updateDto);

      // Should contain exactly the same keys/values as the dto
      expect(partial).toEqual({
        title: 'New title',
        description: 'New description',
        status: true,
        date: new Date('2025-06-01T08:00:00.000Z'),
      });
    });

    it('supports partial updates (undefined fields are preserved as undefined)', () => {
      const updateDto: UpdateTodoDto = {
        title: '   Trim me   ', // verifying that factory does not trim on update
        // other fields intentionally left undefined
      } as unknown as UpdateTodoDto;

      const partial = factory.fromUpdateDto(updateDto);

      expect(partial).toEqual({
        title: '   Trim me   ',
      });
    });
  });
});
