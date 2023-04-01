import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Job } from './Job';
import { Resume } from './Resume';
import { User } from './User';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => Resume, { onDelete: 'CASCADE' })
  resume: Resume;

  @ManyToOne(() => User, { onDelete: 'RESTRICT'})
  user: User;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
