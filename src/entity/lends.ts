import {Entity,PrimaryGeneratedColumn,CreateDateColumn,Column} from "typeorm"


@Entity()
export class Lend {
  @PrimaryGeneratedColumn("uuid")
  lendId: string;

  @Column()
  userId: string;
  
  @Column()
  bookName: string;
  
  @Column()
  mailId:string

  @Column()
  lendDate: string;

  @Column()
  returnDate: string;
  

  @Column({default:false})
  returned:boolean;
}

