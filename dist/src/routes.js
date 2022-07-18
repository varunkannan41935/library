"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function libraryroutes(server, options, done) {
    /*
    server.get('/',async(req,res)=>{
      const book = await server.db.library.find();
       console.log('book', book)
        return book;
    });*/
    server.post('/', async (req, res) => {
        const queryParams = {
            bookName: req.query.bookName,
            authorName: req.query.authorName,
            language: req.query.language,
            genre: req.query.genre,
            createdAt: new Date().toISOString()
        };
        const book = await server.db.library.save(queryParams);
        console.log('book', book);
        return book;
    });
    server.put('/', async (req, res) => {
        const bookId = req.query;
        const bookName = req.body.bookName;
        const authorName = req.body.authorName;
        const language = req.body.language;
        const genre = req.body.genre;
        const createdAt = new Date().toISOString();
        const book = await server.db.library.update(bookId, { bookName, authorName, language, genre, createdAt });
        console.log('book', bookId, book);
        return book;
    });
    server.delete('/', async (req, res) => {
        const queryParams = req.query;
        //const book = await server.db.library.find({where:{ bookName:(queryParams) }}); 
        const deletebook = await server.db.library.delete({ bookName: (queryParams) });
        //console.log(book,queryParams);   
        console.log('QUERYPARAMS: ', queryParams, 'DELETEDBOOK: ', deletebook);
        return deletebook;
    });
    /*server.get('/queryParams',async(req,res)=>{
       const queryParams = req.query;
        const book = await server.db.library.createQueryBuilder("lib")
                                            .select()
                        .where('lib.bookId ILIKE :queryParams', {bookId: `%${queryParams}%`})
                                            .orWhere('lib.bookName ILIKE :queryParams', {bookName: `%${queryParams}%`})
                            .orWhere('lib.authorName ILIKE :queryParams', {queryParams: `%${queryParams}%`})
                        .orWhere('lib.language ILIKE :queryParams', {queryParams: `%${queryParams}%`})
                            .orWhere('lib.genre ILIKE :queryParams', {queryParams: `%${queryParams}%`})
                        .getOne();
    
    
      //const book = await server.db.library.findBy
    
         console.log(queryParams);
          // return (book);
     });
    
    
    server.route({
      method: 'GET',
       url: '/*',
     schema: {querystring: {bookName: { type: 'string' }}},handler: async (request, reply) => {
         const bookName = request.query;
          const book = await server.db.library.find({where:{ bookName:(bookName)}});
           console.log('bookName',bookName);
            return (book);
      }
    });
    */
    server.get('/:queryParams', async (req, res) => {
        const queryParams = req.query;
        const book = await server.db.library.find({ where: { ...queryParams } });
        console.log(queryParams);
        console.log(book);
        return book;
    });
    done();
}
exports.default = libraryroutes;
//# sourceMappingURL=routes.js.map