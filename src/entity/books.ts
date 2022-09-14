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

  @Column( {default: 'available'})
  availability: string;

  @Column()
  donatedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}
