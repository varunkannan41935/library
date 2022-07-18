"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db');
function lendroutes(fastify, options, done) {
    fastify.post('/lendbook', (req, res) => {
        const book = { userId: req.body.userId,
            bookId: req.body.bookId,
            lendDate: new Date(),
            returnDate: req.body.returnDate };
        //const users =  fastify.db.library.findOne({relations: {Library: true,},where:{bookId : book.bookId}})
        console.log('POSTED BOOK : ', book);
        const lendbook = fastify.db.lendrecords.save(book);
        console.log('Lended Book', lendbook);
        return (lendbook);
    });
    fastify.get('/getlendedbooks', (req, res) => {
        const lendbook = fastify.db.lendrecords.find();
        return (lendbook);
    });
    done();
}
exports.default = lendroutes;
;
//# sourceMappingURL=lendroutes.js.map