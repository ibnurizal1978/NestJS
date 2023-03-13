import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class GiftQty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gift_id: string;

  @Column()
  qty: number;

  @Column()
  qty_action: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated_at: Date;
}
