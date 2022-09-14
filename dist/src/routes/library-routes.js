"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../db");
function libraryRoutes(server, options, done) {
    const libRepo = server.db.library;
    server.post("/", async (req, res) => {
        try {
            const newBook = {
                bookName: req.body.bookName,
                authorName: req.body.authorName,
                language: req.body.language,
                genre: req.body.genre,
                availability: req.body.availability,
            };
            console.log("Input Data To Post A Book ->", JSON.stringify(newBook));
            if (JSON.stringify(newBook) === "{}") {
                throw new Error("Invalid Input : Provide the Required Inputs");
            }
            if (typeof newBook.bookName !== "string" || !newBook.bookName) {
                throw new Error("Invalid Input : Provide The Required Input For BookName");
            }
            if (typeof newBook.authorName !== "string" || !newBook.authorName) {
                throw new Error("Invalid Input : Provide The Required Input For AuthorName");
            }
            if (typeof newBook.language !== "string" || !newBook.language) {
                throw new Error("Invalid Input : Provide The Required Input For Language");
            }
            if (typeof newBook.genre !== "string" || !newBook.genre) {
                throw new Error("Invalid Input : Provide The Required Input For Genre");
            }
            if (typeof newBook.availability !== "number" || !newBook.availability) {
                throw new Error("Invalid Input : Provide The Required Input For Availability");
            }
            const getBook = await libRepo.findOne({ where: { bookName: newBook.bookName } });
            if (getBook == null) {
                const postBook = await libRepo.save(newBook);
                console.log("New Book posted in the library -> ", postBook);
                return {
                    status: "SUCCESS",
                    data: postBook,
                    message: "The Book created successfully",
                };
            }
            else {
                throw new Error("Invalid Input : The Book Is Already In The Library");
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
    server.get("/", async (req, res) => {
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
                message: "There Are No Books In The library",
            };
        }
    });
    server.put("/", async (req, res) => {
        try {
            const bookId = req.body.bookId;
            console.log("Query for the book updation ->", bookId);
            if (typeof bookId !== "number" || !bookId) {
                throw new Error("Invalid Input : Provide The Required Input For BookId");
            }
            const newBook = {
                bookName: req.body.bookName,
                authorName: req.body.authorName,
                language: req.body.language,
                genre: req.body.genre,
                availability: req.body.availability,
            };
            console.log(`Input's For Updation ->`, newBook);
            const findBook = await libRepo.findOne({ where: { bookId: bookId } });
            console.log("To find the book For Updation is in the library ->", findBook);
            if (findBook == null) {
                throw new Error("The Book Is Not Found In The Library");
            }
            if (JSON.stringify(newBook) === "{}") {
                throw new Error("Invalid Input : Provide the Required Inputs For Book Updation");
            }
            if (newBook.bookName != undefined || newBook.bookName === null) {
                if (typeof newBook.bookName != "string") {
                    throw new Error("Provide Required Input For bookName");
                }
            }
            else if (newBook.authorName != undefined || newBook.authorName === null) {
                if (typeof newBook.authorName != "string") {
                    throw new Error("Provide Required Input For authorName");
                }
            }
            else if (newBook.language != undefined || newBook.language === null) {
                if (typeof newBook.language != "string") {
                    throw new Error("Provide Required Input For language");
                }
            }
            else if (newBook.genre != undefined || newBook.genre === null) {
                if (typeof newBook.genre != "string") {
                    throw new Error("Provide Required Input For mailId");
                }
            }
            else if (newBook.availability != undefined || newBook.availability === null) {
                if (typeof newBook.availability == "number") {
                    newBook.availability = findBook.availability + newBook.availability;
                }
            }
            const updateBook = await libRepo.update(bookId, { ...newBook });
            console.log("Updated Book ->", updateBook);
            return {
                status: "SUCCESS",
                data: updateBook,
                message: "The Book Updated successfully",
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
    server.delete("/", async (req, res) => {
        try {
            const bookId = req.query.bookId;
            console.log('Input Query ->', Number(bookId));
            if (typeof bookId == 'string') {
                const id = Number(bookId);
                if (isNaN(id)) {
                    throw new Error('Provide Required Input');
                }
                else {
                    const getBook = await libRepo.findOne({ where: { bookId: id } });
                    if (getBook != null) {
                        const deleteBook = await libRepo.delete({ bookId: id });
                        console.log("Deleted Book ->", deleteBook);
                        return {
                            status: "SUCCESS",
                            data: deleteBook,
                            message: "The Book Deleted successfully",
                        };
                    }
                    else {
                        throw new Error("Invalid Input : The Book Is Not In The Library");
                    }
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
    server.get("/getbook", async (req, res) => {
        try {
            const queryParams = {
                bookId: req.query.bookId,
                bookName: req.query.bookName,
                authorName: req.query.authorName,
                genre: req.query.genre,
                language: req.query.language,
                availability: req.query.availability,
            };
            console.log("Input data to get book from library -> ", JSON.stringify(queryParams));
            console.log("Input data ---> ", Object.keys(queryParams).length);
            if (Object.values(queryParams) === 'undefined') {
                throw new Error("Invalid Input : Provide the Required Inputs");
            }
            if (queryParams.bookId == '') {
                throw new Error("Provide Required Input For bookId");
            }
            else if (typeof queryParams.bookId == 'string') {
                const bookId = Number(queryParams.bookId);
                console.log('String to Number->', bookId);
                if (isNaN(bookId)) {
                    throw new Error("Provide Required Input For bookId");
                }
            }
            else if (queryParams.bookName == "") {
                throw new Error("Provide Required Input For bookName");
            }
            else if (queryParams.authorName == "") {
                throw new Error("Provide Required Input For authorName");
            }
            else if (queryParams.language == "") {
                throw new Error("Provide Required Input For language");
            }
            else if (queryParams.genre == "") {
                throw new Error("Provide Required Input For mailId");
            }
            else if (queryParams.availability == 'string') {
                const availability = Number(queryParams.availability);
                if (isNaN(availability)) {
                    throw new Error("Provide Required Input For availability");
                }
            }
            const book = await libRepo.find({ where: { ...queryParams } });
            console.log("Requested Book ->", book);
            if (book.length == 0) {
                throw new Error("The Requested Book Is Not Available ");
            }
            else {
                return {
                    status: "SUCCESS",
                    data: book,
                    message: "The Requested Book is fetched successfully",
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