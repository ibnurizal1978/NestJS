import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class LangCategories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  category_name: string;

  @Column({
    unique: true,
  })
  url: string;

  @Column({
    unique: true,
  })
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated_at: Date;
}
