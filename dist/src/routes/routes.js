"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db');
function libraryroutes(server, options, done) {
    server.get('/', async (req, res) => {
        const book = await server.db.library.find();
        console.log('Getting Available books from the Library ', book);
        return book;
    });
    server.post('/', async (req, res) => {
        const newbook = {
            bookName: req.body.bookName,
            authorName: req.body.authorName,
            language: req.body.language,
            genre: req.body.genre,
            createdAt: new Date().toISOString(),
            availability: req.body.availability
        };
        console.log('Book input for the post method', newbook);
        const book = await server.db.library.save(newbook);
        console.log('New Book posted in the library ', book);
        return book;
    });
    server.put('/', async (req, res) => {
        const bookId = req.query;
        console.log('Requested query for the book updation', bookId);
        const bookName = req.body.bookName;
        const authorName = req.body.authorName;
        const language = req.body.language;
        const genre = req.body.genre;
        const createdAt = new Date().toISOString();
        const availability = req.body.availability;
        const book = await server.db.library.update(bookId, { bookName, authorName, language, genre, createdAt, availability });
        console.log('updated book in the library', book);
        return book;
    });
    server.delete('/', async (req, res) => {
        const queryParams = req.query;
        console.log('Requested query for Book deletion', JSON.stringify(queryParams));
        const deletebook = await server.db.library.delete({ where: { ...queryParams } });
        console.log('Deleted Book in the library', deletebook);
        return deletebook;
    });
    server.get('/getbook', async (req, res) => {
        const queryParams = req.query;
        console.log('Getting input data for QueryParams ', JSON.stringify(queryParams));
        const book = await server.db.library.find({ where: { ...queryParams } });
        console.log('Requested Book using the queryParameter', book);
        return book;
    });
    done();
}
exports.default = libraryroutes;
//# sourceMappingURL=routes.js.map