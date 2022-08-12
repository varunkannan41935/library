import { getRepository } from "typeorm";
import { Library } from "../entity/books";
import { RequestGenericInterface } from "fastify";
const db = require("../db");

export default function libraryRoutes(server, options, done) {
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
			console.log("Input Data To Post A Book ->",JSON.stringify(newBook));

			if (JSON.stringify(newBook) === "{}") {
				throw new Error("Invalid Input : Provide the Required Inputs");
			}

			const getReleventType = {
				bookName: "string",
				authorName: "string",
				language: "string",
				genre: "string",
				availability: "number",
			};

                        Object.entries(newBook).forEach((book) => {
                                const [bookKey, bookValue] = book;
                                console.log("-------", bookValue);

                                Object.entries(getReleventType).forEach(
                                        (type) => {
                                                const [releventTypeKey,releventTypeValue] = type;
                                                if (bookValue != undefined) {
                                                        if (bookKey == releventTypeKey) {
                                                                const newArr = [bookValue,releventTypeValue];
                                                                console.log("--->",newArr[0]);

                                                                if (typeof newArr[0] == newArr[1]) {
                                                                        console.log("--->",typeof bookValue,releventTypeValue);
                                                                } else {
                                                                        throw new Error("Invalid Input : Provide Required Input");
                                                                }
                                                        }
                                                } else{
                                                      throw new Error("Invalid Input : Provide Required Input");
                                                }
                                        }
                                );
                        });


			console.log("Input Data To Post A Book 1->",JSON.stringify(newBook));
			const getBook = await libRepo.findOne({where: { bookName: newBook.bookName }});

			if (getBook == null) {
				const postBook = await libRepo.save(newBook);
				console.log("New Book posted in the library -> ",postBook);

				return {
					status: "SUCCESS",
					data: postBook,
					message: "The Book created successfully",
				};
			} else {
				throw new Error(
					"Invalid Input : The Book Is Already In The Library"
				);
			}
		} catch (e) {
			return {
				status: "ERROR",
				data: null,
				message: e.message,
			};
		}
	});

	server.get("/", async (req, res) => {
		const getBooks = await libRepo.find();
		console.log("Getting Available books from the Library ",getBooks);

		if (getBooks.length != 0) {
			return {
				status: "SUCCESS",
				data: getBooks,
				message: "The Books Fetched successfully",
			};
		} else {
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

			const findBook = await libRepo.findOne({where: { bookId: bookId }});
			console.log("To find the book For Updation is in the library ->",findBook);

			if (findBook == null) {
                                throw new Error("The Book Is Not Found In The Library");
			}

			if (JSON.stringify(newBook) === "{}") {
				throw new Error("Invalid Input : Provide the Required Inputs For Book Updation");
			}

			if (typeof newBook.availability == "number")
				newBook.availability =findBook.availability +newBook.availability;
			console.log(newBook.availability);

			const getReleventType = {
				bookName: "string",
				authorName: "string",
				language: "string",
				genre: "string",
				availability: "number",
			};

			Object.entries(getReleventType).forEach((type) => {
				const [releventTypeKey, releventTypeValue] = type;

				Object.entries(newBook).forEach((book) => {
						const [bookKey,bookValue] = book;

						if (bookValue != undefined ) {


							if (bookKey == releventTypeKey) {
								const newArr = [bookValue,releventTypeValue];

								if (typeof newArr[0] == newArr[1]) {
								} else {
									throw new Error("Invalid Input : Provide Required Input");
								}
							}
						} 
					}
				);
			});

			const updateBook = await libRepo.update(bookId, {...newBook});
			console.log("Updated Book ->", updateBook);
			return {
				status: "SUCCESS",
				data: updateBook,
				message: "The Book Updated successfully",
			};
		} catch (e) {
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
			console.log("Input Query ->", Number(bookId));

			if (typeof bookId == "string") {
				const id = Number(bookId);

				if (isNaN(id)) {
					throw new Error("Invalid Input : Provide Required Input");
				} else {
					const getBook = await libRepo.findOne({where: { bookId: id } });

					if (getBook != null) {
						const deleteBook = await libRepo.delete({bookId: id});
						console.log("Deleted Book ->",deleteBook);

						return { 
							status: "SUCCESS",
							data: deleteBook,
							message: "The Book Deleted successfully",
						};
					} else {
						throw new Error("Invalid Input : The Book Is Not In The Library");
					}
				}
			}
		} catch (e) {
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

			console.log(
				"Input data to get book from library -> ",
				JSON.stringify(Object.entries(queryParams))
			);

			if (JSON.stringify(queryParams) === "{}") {
				throw new Error("Invalid Input : Provide the Required Inputs");
			}

			if (typeof queryParams.bookId == "string") {
				const bookId = Number(queryParams.bookId);

				if (isNaN(bookId)) {
					throw new Error("Invalid Input : Provide Required Input For bookId");
				}
			} else if (queryParams.availability == "string") {
				const availability = Number(queryParams.availability);

				if (isNaN(availability)) {
					throw new Error("Invalid Input : Provide Required Input For availability");
				}
			}

			const book = await libRepo.find({where: { ...queryParams } });
			console.log("Requested Book ->", book);

			if (book.length == 0) {
				throw new Error("The Requested Book Is Not Available ");
			} else {
				return {
					status: "SUCCESS",
					data: book,
					message: "The Requested Book is fetched successfully",
				};
			}
		} catch (e) {
			return {
				status: "ERROR",
				data: null,
				message: e.message,
			};
		}
	});

	done();
}
