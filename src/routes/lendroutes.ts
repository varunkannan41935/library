import {getRepository} from "typeorm"
import { Library } from "../entity/books";
import { Lend } from "../entity/lendrecords";
import { RequestGenericInterface } from 'fastify'
const db = require('../db');


export default function lendroutes(fastify,options,done){

   fastify.post('/lendbook',async(req,res)=>{
   
   const book = {userId: req.body.userId,
                 bookId: req.body.bookId,
                 lendDate: new Date(),
                 returnDate: req.body.returnDate}
    
   console.log('POSTED BOOK : ',book);
  

 const books = await fastify.db.library.find({where:{bookId: book.bookId}})
     console.log('Book from the library',books)

if(){
  const lendbook = await fastify.db.lendrecords.save(book)

    console.log('Lended Book',lendbook)
      return(lendbook)
}

else{
  throw new Error('given bookId is not valid'); 
}

});


fastify.get('/getlendedbooks',(req,res)=>{
 const lendbook = fastify.db.lendrecords.find()
  return (lendbook)
});

done();
};


