import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column()
  mailId: string;


  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable : true, default : 0})
  visitCount: number;

}
