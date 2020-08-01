import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import ServiceCenter from './auxiliaries/ServiceCenter';

@Entity('sample')
class Sample {
  @PrimaryColumn()
  Id: number;

  @Column()
  Identification: string;

  @Column()
  service_center_id: number;

  @OneToOne(() => ServiceCenter, { eager: true })
  @JoinColumn({ name: 'service_center_id' })
  ServiceCenter: ServiceCenter;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Sample;
