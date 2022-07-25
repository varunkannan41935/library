"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db');
function lendRoutes(fastify, options, done) {
    const libRepo = fastify.db.library;
    const userRepo = fastify.db.userrecords;
    const lendRepo = fastify.db.lendrecords;
    fastify.post('/lendbook', async (req, res) => {
        const book = { userId: req.body.userId,
            bookId: req.body.bookId,
            lendDate: new Date(),
            returnDate: req.body.returnDate };
        const books = await libRepo.findOne({ where: { bookId: book.bookId } });
        const user = await userRepo.findOne({ where: { userId: book.userId } });
        if (books != null && user != null) {
            if (books.availability != 0) {
                const lendBook = await lendRepo.save(book);
                if (lendBook.length != 0) {
                    const availability = books.availability - 1;
                    const updatedBook = await libRepo.update(book.bookId, { availability });
                }
                return (lendBook);
            }
            else {
                throw new Error('The Book is not Available');
            }
        }
        else {
            throw new Error('given bookId or userId is not valid');
        }
    });
    fastify.get('/getlendedbooks', async (req, res) => {
        const getLendedBooks = await lendRepo.find();
        return (getLendedBooks);
    });
    fastify.put('/updateduedate', async (req, res) => {
        const booklendId = req.body.booklendId;
        const returnDate = req.body.returnDate;
        const books = await lendRepo.findOne({ where: { lendId: booklendId } });
        if (books != null) {
            const updateReturnDate = await lendRepo.update(booklendId, { returnDate });
            console.log('Updated Return Date of the Book', updateReturnDate);
            return (updateReturnDate);
        }
        else {
            throw new Error('Given LendId is not Valid');
        }
    });
    fastify.get('/lendedbooksbyuser', async (req, res) => {
        const userId = req.query.userId;
        const getBooksByUserId = await lendRepo.find({ where: { userId: userId } });
        console.log('Total Books took by the user ', getBooksByUserId);
        return (getBooksByUserId);
    });
    done();
}
exports.default = lendRoutes;
;
//# sourceMappingURL=lend-routes.js.map