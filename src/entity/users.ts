import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column()
  mailId: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;


}
