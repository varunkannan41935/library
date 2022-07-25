"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db');
function returnRoutes(fastify, options, done) {
    const libRepo = fastify.db.library;
    const userRepo = fastify.db.userrecords;
    const lendRepo = fastify.db.lendrecords;
    const returnRepo = fastify.db.returnrecords;
    fastify.post('/returnbook', async (req, res) => {
        const book = {
            lendId: req.body.lendId,
            bookId: req.body.bookId,
            returnDate: new Date()
        };
        const lendedBook = await lendRepo.findOne({ where: { lendId: book.lendId } });
        const findLendedBook = await lendRepo.findOne({ where: { bookId: book.bookId } });
        const checkUser = await returnRepo.findOne({ where: { lendId: book.lendId } });
        if (findLendedBook != null && lendedBook != null) {
            if (checkUser == null) {
                const returnBook = await returnRepo.save(book);
                console.log('returned Book by the user', returnBook);
                const findBook = await libRepo.findOne({ where: { bookId: book.bookId } });
                const availability = findBook.availability + 1;
                const updatedBook = await libRepo.update(book.bookId, { availability });
                return (returnBook);
            }
            else {
                throw new Error('The Book is Already Returned');
            }
        }
        else {
            throw new Error('given book is not a lended one or the given bookId or userId is not valid');
        }
    });
    fastify.get('/getreturnedbooks', async (req, res) => {
        const getreturnedBooks = await returnRepo.find();
        return (getreturnedBooks);
    });
    done();
}
exports.default = returnRoutes;
//# sourceMappingURL=return-routes.js.map