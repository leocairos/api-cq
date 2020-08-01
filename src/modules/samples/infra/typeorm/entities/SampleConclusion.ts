import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('sample_conclusions')
class SampleConclusion {
  @PrimaryColumn()
  id: number;

  @Column()
  identification: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SampleConclusion;
