import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('analysis_groups')
class AnalisisGroup {
  @PrimaryColumn()
  id: number;

  @Column()
  identification: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AnalisisGroup;
