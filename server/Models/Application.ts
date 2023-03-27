import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Job } from './Job';
import { Resume } from './Resume';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
