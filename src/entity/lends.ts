import {Entity,PrimaryGeneratedColumn,Column,OneToOne,JoinColumn} from "typeorm"


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
