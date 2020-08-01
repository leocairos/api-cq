import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import ServiceCenter from './ServiceCenter';
import SampleConclusion from './SampleConclusion';

@Entity('samples')
class Sample {
  @PrimaryColumn()
  id: number;

  @Column()
  identification: string;

  @Column()
  service_center_id: number;

  @OneToOne(() => ServiceCenter, { eager: true, cascade: true })
  @JoinColumn({ name: 'service_center_id' })
  serviceCenter: ServiceCenter;

  @Column()
  sample_conclusion_id: number;

  @OneToOne(() => SampleConclusion, { eager: true, cascade: true })
  @JoinColumn({ name: 'sample_conclusion_id' })
  sampleConclusion: SampleConclusion;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Sample;
