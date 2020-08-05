import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import ServiceCenter from './ServiceCenter';
import SampleConclusion from './SampleConclusion';
import SampleReason from './SampleReason';
import SampleType from './SampleType';
import CollectionPoint from './CollectionPoint';

@Entity('samples')
class Sample {
  @PrimaryColumn()
  id: number;

  @Column()
  identification: string;

  @Column({ name: 'control_number' })
  controlNumber: string;

  @Column()
  number: number;

  @Column({ name: 'sub_number' })
  subNumber: number;

  @Column()
  year: number;

  @Column()
  revision: number;

  @Column()
  active: boolean;

  @Column({ name: 'sync_portal' })
  syncPortal: boolean;

  @Column()
  received: boolean;

  @Column()
  finalized: boolean;

  @Column()
  published: boolean;

  @Column()
  reviewed: boolean;

  @Column({ name: 'taken_date_time' })
  takenDateTime: Date;

  @Column({ name: 'received_time' })
  receivedTime: Date;

  @Column({ name: 'finalized_time' })
  finalizedTime: Date;

  @Column({ name: 'published_time' })
  publishedTime: Date;

  @Column({ name: 'reviewed_time' })
  reviewedTime: Date;

  @Column()
  service_center_id: number;

  @ManyToOne(() => ServiceCenter, { eager: true, cascade: true })
  @JoinColumn({ name: 'service_center_id' })
  sampleServiceCenter: ServiceCenter;

  @Column()
  sample_conclusion_id: number;

  @ManyToOne(() => SampleConclusion, { eager: true, cascade: true })
  @JoinColumn({ name: 'sample_conclusion_id' })
  sampleConclusion: SampleConclusion;

  @Column()
  sample_reason_id: number;

  @ManyToOne(() => SampleReason, { eager: true, cascade: true })
  @JoinColumn({ name: 'sample_reason_id' })
  sampleReason: SampleReason;

  @Column()
  sample_type_id: number;

  @ManyToOne(() => SampleType, { eager: true, cascade: true })
  @JoinColumn({ name: 'sample_type_id' })
  sampleType: SampleType;

  @Column()
  sample_collection_point_id: number;

  @ManyToOne(() => CollectionPoint, { eager: true, cascade: true })
  @JoinColumn({ name: 'sample_collection_point_id' })
  sampleCollectionPoint: CollectionPoint;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Sample;
