import {getRepository} from "typeorm"
import { Lend } from "../entity/lends";
import { Users } from "../entity/users";
import { Return } from "../entity/returns"
import { RequestGenericInterface } from 'fastify'
const db = require('../db');


export default function returnRoutes(fastify,options,done){

const libRepo = fastify.db.library;
const userRepo = fastify.db.userrecords;
const lendRepo =  fastify.db.lendrecords;
const returnRepo = fastify.db.returnrecords;

fastify.post('/returnbook',async(req,res)=>{

   const book = {
                 lendId: req.body.lendId,
                 bookId: req.body.bookId,
                 returnDate: new Date()
                }
  

      const lendedBook = await lendRepo.findOne({where:{lendId: book.lendId}})
        
        const findLendedBook = await lendRepo.findOne({where:{bookId:book.bookId}})
            
          const checkUser = await returnRepo.findOne({where:{lendId:book.lendId}})
            
if(findLendedBook != null && lendedBook != null){
              
    if(checkUser == null){
          
            const returnBook = await returnRepo.save(book);
                console.log('returned Book by the user',returnBook);
                                    
       if(returnBook != null_{
         const updatedBook = await libRepo.update(book.bookId,{availability+1})}
        return(returnBook);
          
    }
    else{ throw new Error('The Book is Already Returned'); 
        }
} 
else{
     throw new Error('given book is not a lended one or the given bookId or userId is not valid');
    }

});

fastify.get('/getreturnedbooks',async (req,res)=>{

    const getreturnedBooks = await returnRepo.find()
     return (getreturnedBooks)
});

done()
}

