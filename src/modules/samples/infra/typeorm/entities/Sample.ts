import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import ServiceCenter from './ServiceCenter';
import SampleConclusion from './SampleConclusion';
import SampleReason from './SampleReason';
import SampleType from './SampleType';
import CollectionPoint from './CollectionPoint';
import SampleStatus from './SampleStatus';
import MyLIMSUser from './MyLIMSUser';
import SampleAnalyse from './SampleAnalyse';
import SampleInfo from './SampleInfo';
import SampleMethod from './SampleMethod';

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

  @Column({ name: 'current_status_edition_date_time' })
  currentStatusEditionDateTime: Date;

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

  @Column()
  sample_status_id: number;

  @ManyToOne(() => SampleStatus, { eager: true, cascade: true })
  @JoinColumn({ name: 'sample_status_id' })
  sampleStatus: SampleStatus;

  @Column()
  current_status_user_id: number;

  @ManyToOne(() => MyLIMSUser, { eager: true, cascade: true })
  @JoinColumn({ name: 'current_status_user_id' })
  currentStatusUser: MyLIMSUser;

  @OneToMany(() => SampleAnalyse, sampleAnalyse => sampleAnalyse.sample, {
    cascade: true,
    eager: true,
  })
  sample_Analyse: SampleAnalyse[];

  @OneToMany(() => SampleInfo, sampleInfo => sampleInfo.sample, {
    cascade: true,
    eager: true,
  })
  sample_Info: SampleInfo[];

  /* @OneToMany(() => SampleMethod, sampleMethod => sampleMethod.sample, {
    cascade: true,
    eager: true,
  })
  sample_Method: SampleMethod[]; */

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ name: 'hash_mail' })
  hashMail: string;
}

export default Sample;
