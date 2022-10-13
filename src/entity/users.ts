import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column()
  mailId: string;


  @Column()
  role: string;

  @Column()
  createdAt: string;

  @Column({nullable : true, default : 0})
  visitCount: number;

}
