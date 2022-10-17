import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"

@Entity()
export class Library {
  @PrimaryGeneratedColumn("uuid")
  bookId: string;

  @Column()
  bookName: string;

  @Column()
  authorName: string;

  @Column()
  language: string;

  @Column()
  genre: string;

  @Column( {default: true})
  available: boolean;

  @Column()
  donatedBy: string;


  @CreateDateColumn()
  createdAt: Date;

}
