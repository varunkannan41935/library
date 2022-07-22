import {getRepository} from "typeorm"
import { Library } from "../entity/books";
import { RequestGenericInterface } from 'fastify'
const db = require('../db');



export default function libraryRoutes(server,options,done){

server.get('/',async(req,res)=>{
  const getBook = await server.db.library.find();
   
    console.log('Getting Available books from the Library ', getBook)
    
      return getBook;
});


server.post('/',async (req,res)=>{
 
   const newbook = {
                   bookName: req.body.bookName,
                   authorName: req.body.authorName,
                   language: req.body.language,
                   genre: req.body.genre,
                   createdAt: new Date().toISOString(),
                   availability: req.body.availability
                   }
  
   console.log('Book input for the post method',newbook)
  
 const postBook = await server.db.library.save(newbook)
   console.log('New Book posted in the library ',postBook)  
    
    return postBook;
});

server.put('/',async (req,res)=>{
  const bookId = req.body.bookId;
    console.log('Requested query for the book updation',bookId); 
  
  const bookName = req.body.bookName;
    const authorName = req.body.authorName;
     const language = req.body.language;
      const genre = req.body.genre;
       const createdAt = new Date().toISOString();
        const availability = req.body.availability;
  
  const updateBook = await server.db.library.update(bookId,{bookName,authorName,language,genre,createdAt,availability});
   console.log('updated book in the library',updateBook)
    
     return updateBook;
});

server.delete('/',async(req,res)=>{
  
  const queryParams = req.query;
      console.log('Requested query for Book deletion',JSON.stringify(queryParams)) 
      
  const deleteBook = await server.db.library.delete({...queryParams});
      console.log('Deleted Book in the library',deleteBook);
       
        return deleteBook;
});

server.get('/getbook',async(req,res)=>{
   const queryParams = req.query;
     console.log('Getting input data for QueryParams ',JSON.stringify(queryParams));

  const book = await server.db.library.find( { where: {...queryParams} } )
      console.log('Requested Book using the queryParameter',book);
if(book.length == 0){
  throw new Error('The Book is not available')}
else{ 
    return book;
}    
});

done();
}




