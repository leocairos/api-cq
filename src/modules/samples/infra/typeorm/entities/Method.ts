import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import MethodType from './MethodType';

@Entity('methods')
class Method {
  @PrimaryColumn()
  id: number;

  @Column()
  identification: string;

  @Column()
  method_type_id: number;

  @ManyToOne(() => MethodType, { eager: true, cascade: true })
  @JoinColumn({ name: 'method_type_id' })
  methodMethodType: MethodType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Method;
