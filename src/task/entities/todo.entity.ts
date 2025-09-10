import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column({ default: false })
  public status: boolean;

  @Column({ type: 'date', nullable: true })
  public date: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;
}
