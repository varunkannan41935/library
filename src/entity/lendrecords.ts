import {Entity,PrimaryGeneratedColumn,Column,OneToOne,JoinColumn} from "typeorm"
import { Library } from "./books"


@Entity()
export class Lend {
  @PrimaryGeneratedColumn()
  lendId: Number;

  @Column()
  userId: Number;
  
  @Column()
  bookId: Number;

  @Column()
  lendDate: String;

  @Column()
  returnDate: String;

}
