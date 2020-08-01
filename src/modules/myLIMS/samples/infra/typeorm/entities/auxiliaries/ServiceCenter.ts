import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('service_centers')
class ServiceCenter {
  @PrimaryColumn()
  Id: number;

  @Column()
  Identification: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ServiceCenter;
