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
import ServiceArea from './ServiceArea';
import MyLIMSUser from './MyLIMSUser';
import MethodStatus from './MethodStatus';

@Entity('sample_methods')
class SampleMethod {
  @PrimaryColumn()
  id: number;

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
  service_area_id: number;

  @ManyToOne(() => ServiceArea)
  @JoinColumn({ name: 'service_area_id' })
  serviceArea: ServiceArea;

  @Column()
  method_status_id: number;

  @ManyToOne(() => MethodStatus)
  @JoinColumn({ name: 'method_status_id' })
  methodStatus: MethodStatus;

  @Column()
  edition_user_id: number;

  @ManyToOne(() => MyLIMSUser)
  @JoinColumn({ name: 'edition_user_id' })
  editionUser: MyLIMSUser;

  @Column({ name: 'edition_data_time' })
  editionDateTime: Date;

  @Column()
  execute_user_id: number;

  @ManyToOne(() => MyLIMSUser)
  @JoinColumn({ name: 'execute_user_id' })
  executeUser: MyLIMSUser;

  @Column({ name: 'execute_data_time' })
  executeDateTime: Date;

  @Column()
  start_user_id: number;

  @ManyToOne(() => MyLIMSUser)
  @JoinColumn({ name: 'start_user_id' })
  startUser: MyLIMSUser;

  @Column({ name: 'start_data_time' })
  startDateTime: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SampleMethod;
