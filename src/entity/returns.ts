import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"


@Entity()
export class Return {
  @PrimaryGeneratedColumn()
  returnId: Number;

  @Column()
  lendId: Number;

  @Column()
  userId: Number;
  
  @CreateDateColumn()
  returnDate: String;

}
