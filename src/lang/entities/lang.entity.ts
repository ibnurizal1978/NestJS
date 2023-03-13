import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Lang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lang_categories_id: string;

  @Column()
  tags_id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated_at: Date;
}
