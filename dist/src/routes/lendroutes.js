"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db');
function lendroutes(fastify, options, done) {
    fastify.post('/lendbook', async (req, res) => {
        const book = { userId: req.body.userId,
            bookId: req.body.bookId,
            lendDate: new Date(),
            returnDate: req.body.returnDate };
        console.log('POSTED BOOK : ', book);
        const books = await fastify.db.library.find({ where: { bookId: book.bookId } });
        console.log('Book from the library', books);
        const user = await fastify.db.userrecords.find({ where: { userId: book.userId } });
        console.log('User from the userrecords', user);
        if (books.length != 0 && user.length != 0) {
            const lendbook = await fastify.db.lendrecords.save(book);
            console.log('Lended Book', lendbook);
            return (lendbook);
        }
        else {
            throw new Error('given bookId or userId is not valid');
        }
    });
    fastify.get('/getlendedbooks', (req, res) => {
        const lendbook = fastify.db.lendrecords.find();
        return (lendbook);
    });
    fastify.put('/updateduedate', async (req, res) => {
        const booklendId = req.body.booklendId;
        const returnDate = req.body.returnDate;
        const books = await fastify.db.lendrecords.findOne({ where: { lendId: booklendId } });
        console.log('To check if the book is lended or not', books);
        if (books != null) {
            const updateReturnDate = await fastify.db.lendrecords.update(booklendId, { returnDate });
            console.log('Updated Return Date of the Book', updateReturnDate);
            return (updateReturnDate);
        }
        else {
            throw new Error('Given LendId is not Valid');
        }
    });
    fastify.get('/lendedBooksByuser', async (req, res) => {
        const userId = req.query.userId;
        const getbooksbyuserId = await fastify.db.lendrecords.find({ where: { userId: userId } });
        console.log('Total Books took by the user ', getbooksbyuserId);
        return (getbooksbyuserId);
    });
    done();
}
exports.default = lendroutes;
;
//# sourceMappingURL=lendroutes.js.map