import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Sample from './Sample';
import Info from './Info';

@Entity('sample_infos')
class SampleInfo {
  @PrimaryColumn()
  id: number;

  @Column()
  order: number;

  @Column({ name: 'display_value' })
  displayValue: string;

  @Column()
  info_id: number;

  @ManyToOne(() => Info)
  @JoinColumn({ name: 'info_id' })
  info: Info;

  @Column()
  sample_id: number;

  @ManyToOne(() => Sample)
  @JoinColumn({ name: 'sample_id' })
  sample: Sample;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SampleInfo;
