import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"

@Entity()
export class Library {
  @PrimaryGeneratedColumn()
  bookId: number;

  @Column()
  bookName: string;

  @Column()
  authorName: string;

  @Column()
  language: string;

  @Column()
  genre: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  availability: number;

}
