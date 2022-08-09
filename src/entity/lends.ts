import {Entity,PrimaryGeneratedColumn,CreateDateColumn,Column} from "typeorm"


@Entity()
export class Lend {
  @PrimaryGeneratedColumn()
  lendId: Number;

  @Column()
  userId: Number;
  
  @Column()
  bookId: Number;

  @CreateDateColumn()
  lendDate: Date;

  @Column()
  returnDate: String;

  @Column()
  returned:boolean;
}

