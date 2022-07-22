import {getRepository} from "typeorm"
import { Lend } from "../entity/lends";
import { Users } from "../entity/users";
import { Return } from "../entity/returns"
import { RequestGenericInterface } from 'fastify'
const db = require('../db');


export default function returnRoutes(fastify,options,done){

fastify.post('/returnbook',async(req,res)=>{

   const book = {
                 userId: req.body.userId,
                 bookId: req.body.bookId,
                 lendId: req.body.lendId,
                 returnDate: new Date()
                }
  

      const lendedBook = await fastify.db.lendrecords.findOne({where:{lendId: book.lendId}})
           //console.log('lended Book',lendedBook)
        
        const user = await fastify.db.lendrecords.findOne({where:{userId:book.userId}})
             //console.log('User from the userrecords',user)
           
          const findLendedBook = await fastify.db.lendrecords.findOne({where:{bookId:book.bookId}})
               //console.log('Book from the lendRecords',findLendedBook)                    
            
            const checkUser = await fastify.db.returnrecords.findOne({where:{lendId:book.lendId}})
                 //console.log('To check the book is already returned or not',checkUser);
            
if(findLendedBook != null && user != null){
              
    if(checkUser == null && lendedBook != null ){
          
            const returnBook = await fastify.db.returnrecords.save(book);
                console.log('returned Book by the user',returnBook);
                                    
       
     const findBook = await fastify.db.library.findOne({where:{bookId:book.bookId}})
           console.log('To find the book in lend records',findBook)         
     
       const availability = findBook.availability+1;
               console.log('To check the availability',availability) 
    
     const updatedBook = await fastify.db.library.update(book.bookId,{availability})
          console.log('updated Book after returned',updatedBook)      
                      return(returnBook);
          
    }
    else{ throw new Error('The Book is Already Returned or lend Id is wrong');}
}
else{
     throw new Error('given book is not a lended one or the given bookId or userId is not valid');
}

});

fastify.get('/getreturnedbooks',async (req,res)=>{

    const getreturnedBooks =await fastify.db.returnrecords.find()
     return (getreturnedBooks)
});

done()
}

