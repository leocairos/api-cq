import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ServiceCenter from './ServiceCenter';

@Entity('service_areas')
class ServiceArea {
  @PrimaryColumn()
  id: number;

  @Column()
  identification: string;

  @Column()
  service_center_id: number;

  @ManyToOne(() => ServiceCenter, { eager: true, cascade: true })
  @JoinColumn({ name: 'service_center_id' })
  sampleServiceCenter: ServiceCenter;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ServiceArea;
