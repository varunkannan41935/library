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
                userId: req.body.user.userId,
                bookName: req.body.data.bookName,
                mailId: req.body.user.mailId,
                lendDate: Date(),
                returnDate: "Not Returned",
            };
            console.log("Input To lend a book ->", book);
            Object.entries(book).forEach((entry) => {
                const [bookKey, bookValue] = entry;
                if (typeof bookValue !== "string" || bookValue == undefined || entry[1] == 0) {
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
    /**fastify.put("/updateduedate", async (req, res) => {
        try {
            const bookName = req.body.data.bookName;
            const returnDate = req.body.data.returnDate;
                        const user = req.body.user;

            if (typeof bookName != "string" || !bookName) {
                throw new Error("Invalid Input: Provide Required Input");
            }

            const findBook = await libRepo.findOne({where: { bookName },});
            console.log("To Find The Book Is In The Library --->",findBook);

            const books = await lendRepo.findOne({where: {userId: user.userId, bookName, returned: false,}});
            console.log("To Update book --->", books);

            if (books != null && findBook != null) {
                const updateReturnDate = await lendRepo.update(books.lendId,{ returnDate });
                console.log("Updated Return Date of the Book ->",updateReturnDate);

                return {
                    status: "SUCCESS",
                    data: updateReturnDate,
                    message: "The Book Updated successfully",
                };
            } else {
                throw new Error("Invalid Input");
            }
        } catch (e) {
            return {
                status: "ERROR",
                data: null,
                message: e.message,
            };
        }
    });**/
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
    /**fastify.post("/issuebook", async (req, res) => {
        try {
            const book = {
                userId: "",
                mailId: req.body,
                bookName: req.body.bookName,
                                returnDate: req.body.returnDate,
            };

            const findBook = await libRepo.findOne({where: { bookName: book.bookName },});
            console.log("To Find The Book Is In The Library --->",findBook);

            if (findBook != null && findBook.availability != 0) {
                const issueBook = await lendRepo.save(book);

                const updatedBook = await libRepo.update(findBook.bookId,{availability:findBook.availability -1,});
                console.log("Decrement in Availability ->",updatedBook);

                return {
                    status: "SUCCESS",
                    data: issueBook,
                    message: "The Book issued successfully",
                };
            } else {
                throw new Error(`${book.bookName} Is Not Available`);
            }
        } catch (e) {
            return {
                status: "ERROR",
                data: null,
                message: e.message,
            };
        }
    });**/
    done();
}
exports.default = lendRoutes;
//# sourceMappingURL=lend-routes.js.map