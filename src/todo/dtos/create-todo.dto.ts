import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsOptional()
  public description: string;

  @IsDate()
  public date: Date;
}
