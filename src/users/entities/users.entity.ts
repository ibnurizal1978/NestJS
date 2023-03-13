import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public first_name: string;

  @Column()
  public last_name: string;

  @Column()
  company: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  country: string;

  @Column({ default: '' })
  reset_pwd_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated_at: Date;
}
