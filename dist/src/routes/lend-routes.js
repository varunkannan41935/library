"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../db");
function lendRoutes(fastify, options, done) {
    const libRepo = fastify.db.library;
    const userRepo = fastify.db.userrecords;
    const lendRepo = fastify.db.lendrecords;
    console.log('verifying whether the control flows through lend Routes');
    fastify.post("/lendbook", async (req, res) => {
        try {
            const book = {
                userId: req.body.user.userId,
                bookName: req.body.data.bookName,
                mailId: req.body.user.mailId,
                lendDate: Date(),
                returnDate: "Not Returned",
            };
            console.log("Input To lend a book ->", book);
            Object.entries(book).forEach((entry) => {
                const [bookKey, bookValue] = entry;
                if (typeof entry[1] !== "string" || entry[1] == undefined || entry[1].trim().length == 0) {
                    throw new Error("Invalid Input : Provide Required Input");
                }
            });
            const findBook = await libRepo.findOne({ where: { bookName: book.bookName }, });
            console.log("To Find The Book Is In The Library --->", findBook);
            if (findBook == null) {
                throw new Error(`The Requested Book ${book.bookName} Is Not Available In The Library`);
            }
            if (findBook != null && findBook.availability === 'available') {
                const lendBook = await lendRepo.save(book);
                const updatedBook = await libRepo.update(findBook.bookId, { availability: "not available" });
                console.log('update availability', updatedBook.availability);
                return {
                    status: "SUCCESS",
                    data: lendBook,
                    message: "The Book Lent successfully",
                };
            }
            else {
                throw new Error(`${book.bookName} Is Not Available`);
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
        const getLendedBooks = await lendRepo.find({ where: { returned: false } });
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
    fastify.get("/lendedbooksbyuser", async (req, res) => {
        try {
            const userId = req.body.user.userId;
            console.log("UserId as input queryParams ->", userId);
            const booksLentByUser = await lendRepo.findOne({ where: { userId }, });
            console.log("Total Books lend by particular user ->", booksLentByUser);
            if (booksLentByUser != null) {
                const lendBooks = await lendRepo.findOne({ where: { userId, returned: false }, });
                if (lendBooks != null) {
                    return {
                        status: "SUCCESS",
                        data: booksLentByUser,
                        message: "The Total Lent Books By user Found successfully",
                    };
                }
                else {
                    throw new Error("The User Returned Every Books");
                }
            }
            else {
                throw new Error("The User Does Not Lend Any Books");
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