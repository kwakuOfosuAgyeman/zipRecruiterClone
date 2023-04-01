import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contactInfo: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  workExperience: string;

  @Column({ nullable: true })
  skills: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({nullable: true})
  coverLetter: string;

  @Column({nullable: false})
  filename: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
