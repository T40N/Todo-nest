import { IsBoolean, IsDate, IsString } from 'class-validator';

export class TodoDto {
  constructor(partial: Partial<TodoDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  public id: string;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsBoolean()
  public status: boolean;

  @IsDate()
  public date: Date;
}
