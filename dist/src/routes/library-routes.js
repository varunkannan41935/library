"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const db = require("../db");
function libraryRoutes(fastify, options, done) {
    const libRepo = fastify.db.library;
    console.log('verifying whether controlm flows through Library Routes');
    fastify.post("/postbook", async (req, res) => {
        try {
            const newBook = {
                bookName: req.body.data.bookName,
                authorName: req.body.data.authorName,
                language: req.body.data.language,
                genre: req.body.data.genre,
                donatedBy: req.body.data.donatedBy,
                createdAt: Date(),
            };
            console.log("Input Data To Post A Book ->", newBook);
            Object.entries(newBook).forEach((book) => {
                const [bookKey, bookValue] = book;
                if (book[1] == undefined || book[1] == null || book[1].trim().length == 0) {
                    throw new Error(`Invalid Input : Provide Required input for ${bookKey}`);
                }
            });
            const getBook = await libRepo.findOne({ where: { bookName: (0, typeorm_1.ILike)(newBook.bookName) } });
            console.log("To Check Whether The Book Is Already In The library -->", getBook);
            if (getBook == null) {
                const postBook = await libRepo.save(newBook);
                console.log("New Book posted in the library -> ", postBook);
                return {
                    status: "SUCCESS",
                    data: postBook,
                    message: `${newBook.bookName} book added successfully`,
                };
            }
            else {
                throw new Error(`Invalid Input : ${newBook.bookName.trim()} Is Already In The Library`);
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
    fastify.get("/getallbooks", async (req, res) => {
        const getBooks = await libRepo.find();
        console.log("Getting Available books from the Library ", getBooks);
        if (getBooks.length != 0) {
            return {
                status: "SUCCESS",
                data: getBooks,
                message: "The Books Fetched successfully",
            };
        }
        else {
            return {
                status: "ERROR",
                data: null,
                message: "No Books are there In The library",
            };
        }
    });
    fastify.put("/updatebook", async (req, res) => {
        try {
            const bookName = req.body.data.bookName;
            console.log("Query for the book updation ->", bookName);
            if (typeof bookName !== "string" || !bookName) {
                throw new Error("Invalid Input : Provide The Required Input For BookName");
            }
            const newBook = {
                authorName: req.body.data.authorName,
                language: req.body.data.language,
                genre: req.body.data.genre,
                donatedBy: req.body.data.donatedBy,
            };
            console.log(`Input's For Updation --->`, newBook.donatedBy);
            const findBook = await libRepo.findOne({ where: { bookName: (0, typeorm_1.ILike)(bookName) }, });
            console.log("To find the book For Updation is in the library ->", findBook);
            if (findBook == null) {
                throw new Error(`The Book ${bookName} Is Not Found In The Library`);
            }
            if (JSON.stringify(newBook) === "{}") {
                throw new Error("Invalid Input : Provide the Required Inputs For Book Updation");
            }
            Object.entries(newBook).forEach((book) => {
                const [bookKey, bookValue] = book;
                if (book[1] != undefined && book[1] != null) {
                    if (typeof book[1] != "string" || book[1].trim().length == 0) {
                        throw new Error(`Invalid Input: Provide Required Input for ${bookKey}`);
                    }
                }
            });
            const updateBook = await libRepo.update(findBook.bookId, { ...newBook, createdAt: new Date() });
            const updatedBook = await libRepo.findOne({ where: { bookName, donatedBy: newBook.donatedBy } });
            console.log('updated book --->', updatedBook);
            return {
                status: "SUCCESS",
                updatedData: updatedBook,
                message: `The Book ${bookName} Updated successfully`,
            };
        }
        catch (e) {
            return {
                status: "ERROR",
                data: null,
                message: e.message,
            };
        }
    });
    fastify.delete("/deletebook", async (req, res) => {
        try {
            const bookName = req.query.bookName;
            console.log("Input Query For Book Deletion --->", bookName);
            if (typeof bookName != "string") {
                throw new Error("Invalid Input : Provide Required Input");
            }
            else {
                const getBook = await libRepo.findOne({ where: { bookName: (bookName) }, });
                if (getBook != null) {
                    const deleteBook = await libRepo.delete({ bookName });
                    return {
                        status: "SUCCESS",
                        message: `The Book ${bookName} Deleted successfully`,
                    };
                }
                else {
                    throw new Error(`Invalid Input : Book Unavailable`);
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
    fastify.get("/getbookbyquery", async (req, res) => {
        try {
            const queryParams = {
                bookName: req.query.bookName,
                authorName: req.query.authorName,
                language: req.query.language,
                genre: req.query.genre,
                availability: req.query.availability,
                donatedBy: req.query.donatedBy,
            };
            console.log("queryParams to get book from library -> ", queryParams);
            if (JSON.stringify(queryParams) === "{}") {
                throw new Error("Invalid Input : Provide the Required Inputs");
            }
            const book = await libRepo.find({ where: { ...queryParams } });
            console.log("Requested Book --->", book);
            if (book.length == 0) {
                throw new Error(`The Request Is Not Available`);
            }
            else {
                return {
                    status: "SUCCESS",
                    data: book,
                    message: "The Requested Book fetched successfully",
                };
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
exports.default = libraryRoutes;
//# sourceMappingURL=library-routes.js.map