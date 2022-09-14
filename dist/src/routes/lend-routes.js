"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../db");
function lendRoutes(fastify, options, done) {
    const libRepo = fastify.db.library;
    const userRepo = fastify.db.userrecords;
    const lendRepo = fastify.db.lendrecords;
    fastify.post("/lendbook", async (req, res) => {
        try {
            const book = {
                userId: req.body.userId,
                bookId: req.body.bookId,
                returnDate: req.body.returnDate,
                returned: false,
            };
            console.log("Input To lend a book ->", book);
            if (JSON.stringify(book) == '{}') {
                throw new Error("Invalid Input : Provide The Required Input");
            }
            if (typeof (book.userId) !== 'number' || !book.userId) {
                throw new Error("Invalid Input : Provide The Required Input For UserId");
            }
            if (typeof (book.bookId) !== 'number' || !book.bookId) {
                throw new Error("Invalid Input : Provide The Required Input For AuthorName");
            }
            const books = await libRepo.findOne({ where: { bookId: book.bookId } });
            const user = await userRepo.findOne({ where: { userId: book.userId }, });
            if (books != null && user != null) {
                if (books.availability != 0) {
                    const lendBook = await lendRepo.save(book);
                    const updatedBook = await libRepo.update(books.bookId, { availability: books.availability - 1 });
                    console.log("To Test The Decrement in Availability ->", updatedBook);
                    return {
                        status: "SUCCESS",
                        data: lendBook,
                        message: "The Book Lent successfully",
                    };
                }
                else {
                    throw new Error("The Book Is Not Available");
                }
            }
            else {
                throw new Error("The Provided BookId Or UserId Is Not Valid");
            }
        }
        catch (e) {
            return {
                status: "ERROR",
                data: null,
                message: e.message,
            };
        }
    });
    fastify.get("/getlendedbooks", async (req, res) => {
        const getLendedBooks = await lendRepo.find({
            where: { returned: false },
        });
        console.log("Check the Lent books ->", getLendedBooks);
        if (getLendedBooks.length != 0) {
            return {
                status: "SUCCESS",
                data: getLendedBooks,
                message: "The Lent Books Fetched successfully",
            };
        }
        else {
            return {
                status: "ERROR",
                data: null,
                message: "There Are No Lent Books In The library",
            };
        }
    });
    fastify.put("/updateduedate", async (req, res) => {
        const booklendId = req.body.lendId;
        const returnDate = req.body.returnDate;
        if (typeof booklendId !== "number" || !booklendId) {
            throw new Error("Invalid Input : Provide The Required Input For BookId");
        }
        const books = await lendRepo.findOne({ where: { lendId: booklendId }, });
        if (books != null) {
            const updateReturnDate = await lendRepo.update(booklendId, { returnDate });
            console.log("Updated Return Date of the Book ->", updateReturnDate);
            return {
                status: "SUCCESS",
                data: updateReturnDate,
                message: "The Book Updated successfully",
            };
        }
        else {
            return {
                status: "ERROR",
                data: null,
                message: "Given Lend Id Is Not Valid",
            };
        }
    });
    fastify.get("/lendedbooksbyuser", async (req, res) => {
        try {
            const userId = req.query.userId;
            console.log("UserId as input queryParams ->", typeof userId);
            const id = Number(userId);
            if (isNaN(id)) {
                throw new Error('Provide Required Input');
            }
            else {
                const findUser = await userRepo.findOneBy({ userId });
                console.log("To Find The User Id Is In The User Repo ->", findUser);
                const booksLentByUser = await lendRepo.findOne({ where: { userId } });
                console.log('Total Books lend by particular user ->', booksLentByUser);
                if (findUser == null && booksLentByUser == null) {
                    throw new Error("Given User Id Is Not Valid");
                }
                else if (booksLentByUser != null) {
                    const lendBooks = await lendRepo.findOne({ where: { userId, returned: false } });
                    if (lendBooks != null) {
                        return {
                            status: "SUCCESS",
                            data: booksLentByUser,
                            message: "The Total Lent Books By user Found successfully",
                        };
                    }
                    else {
                        throw new Error("The User Returned Every Lent Books");
                    }
                }
                else {
                    throw new Error('The User Does Not Lend Any Books');
                }
            }
        }
        catch (e) {
            return {
                status: "ERROR",
                data: null,
                message: e.message,
            };
        }
    });
    done();
}
exports.default = lendRoutes;
//# sourceMappingURL=lend-routes.js.map