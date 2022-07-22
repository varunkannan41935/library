import {getRepository} from "typeorm"
import { Library } from "../entity/books";
import { Lend } from "../entity/lends";
import { Users } from "../entity/users";
import { RequestGenericInterface } from 'fastify'
const db = require('../db');


export default function lendRoutes(fastify,options,done){

fastify.post('/lendbook',async(req,res)=>{
   
   const book = {userId: req.body.userId,
                 bookId: req.body.bookId,
                 lendDate: new Date(),
                 returnDate: req.body.returnDate}
     console.log('POSTED BOOK : ',book.bookId);
   
       const books = await fastify.db.library.find({where:{bookId: book.bookId}})
           //console.log('Book from the library',books)
          
         const user = await fastify.db.userrecords.find({where:{userId:book.userId}})
             //console.log('User from the userrecords',user)        
             
           const findBook = await fastify.db.library.findOne({where:{bookId:book.bookId}})
                console.log('availability of the book',findBook)

if(books.length != 0 && user.length != 0){
    
      if(findBook.availability != 0){                
      
    const lendBook = await fastify.db.lendrecords.save(book)
       console.log('Lended Book',lendBook)
                                    
      const lendedBook = await fastify.db.library.find({where:{bookId:book.bookId}})
         if(lendedBook.length != 0){                 
          
        const availability = findBook.availability-1;
           console.log('To check the availability of the book',availability);
             
          const updatedBook = await fastify.db.library.update(book.bookId,{availability});
             console.log('updated availability of the book',updatedBook); 
                 
         }
          return(lendBook)
}     
else{
     throw new Error('The Book is not Available');
}  
}
else{
     throw new Error('given bookId or userId is not valid'); 
}

});

fastify.get('/getlendedbooks',async(req,res)=>{
 
    const getLendedBooks =await fastify.db.lendrecords.find()
     return (getLendedBooks)
});

fastify.put('/updateduedate',async(req,res)=>{

 const booklendId = req.body.booklendId;
 const returnDate = req.body.returnDate;
   
   const books = await fastify.db.lendrecords.findOne({where:{lendId:booklendId}})
     console.log('To check if the book is lended or not',books) 
  
 if(books != null){
       const updateReturnDate = await fastify.db.lendrecords.update(booklendId,{returnDate})
         console.log('Updated Return Date of the Book',updateReturnDate)
            return (updateReturnDate)           
 }
 else{
   throw new Error('Given LendId is not Valid')
 }

});

fastify.get('/lendedbooksbyuser',async(req,res)=>{
  const userId = req.query.userId;
      
    const getBooksByUserId = await fastify.db.lendrecords.find({where:{userId:userId}})
      console.log('Total Books took by the user ',getBooksByUserId) 
        return (getBooksByUserId) 
});

done();
};


