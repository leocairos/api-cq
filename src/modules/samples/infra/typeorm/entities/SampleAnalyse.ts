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
import Method from './Method';
import AnalisisGroup from './AnalysisGroup';
import Info from './Info';

@Entity('sample_analyses')
class SampleAnalyse {
  @PrimaryColumn()
  id: number;

  @Column()
  order: number;

  @Column({ name: 'measurement_unit' })
  measurementUnit: string;

  @Column({ name: 'display_value' })
  displayValue: string;

  @Column({ name: 'value_float', type: 'decimal', precision: 14, scale: 6 })
  valueFloat: number;

  @Column({ name: 'reference_method' })
  referenceMethod: string;

  @Column({ name: 'method_analysis_type' })
  methodAnalysisType: string;

  @Column()
  conclusion: string;

  @Column()
  sample_id: number;

  @ManyToOne(() => Sample)
  @JoinColumn({ name: 'sample_id' })
  sample: Sample;

  @Column()
  method_id: number;

  @ManyToOne(() => Method)
  @JoinColumn({ name: 'method_id' })
  method: Method;

  @Column()
  analysis_group_id: number;

  @ManyToOne(() => AnalisisGroup)
  @JoinColumn({ name: 'analysis_group_id' })
  analysisGroup: AnalisisGroup;

  @Column()
  info_id: number;

  @ManyToOne(() => Info)
  @JoinColumn({ name: 'info_id' })
  info: Info;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SampleAnalyse;
