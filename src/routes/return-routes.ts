import { getRepository } from "typeorm";
import { Lend } from "../entity/lends";
import { Users } from "../entity/users";
import { Library } from "../entity/books";
import { RequestGenericInterface } from "fastify";
const db = require("../db");

export default function returnRoutes(fastify, options, done) {
	const lendRepo = fastify.db.lendrecords;
	const libRepo = fastify.db.library;
	const userRepo = fastify.db.userrecords;

        console.log('verifying whether control flows through return Routes');

	fastify.post("/returnbook", async (req, res) => {
		try {
			const bookName = req.body.data.bookName;

                        const user = req.body.user    
  			console.log("To Check The Input ->", bookName);
                        console.log("To Check The user ->",user);   
                        console.log("REQ BODY",req.body);  

			if (bookName == undefined || bookName.trim().length === 0) {
				throw new Error("Invalid Input : Provide Required Input");
			}
                        
                        const findBook = await libRepo.findOne({where: {bookName}});
                        console.log('FIND BOOK',findBook)
                
                        if (findBook == null){
                              throw new Error(`The book ${bookName} is not found`)
                        } 

                        const lendInfo = await lendRepo.findOne({where: {userId: user.userId, bookName, returned : false}})
                        console.log('LEND INFO',lendInfo);      

                        const findUser = await lendRepo.find({where: {userId: user.userId}})
                        console.log('FIND USER',findUser); 

                        if(lendInfo != null){
         
                              const updateStatus = await lendRepo.update(lendInfo.lendId,{returnDate: Date(), returned : true});
    
                              const updateAvailability = await libRepo.update(findBook.bookId, {availability : "available" })
                               
                              return {
                                      status: "SUCCESS",
                                      data: updateStatus,
                                      message: `The Book ${bookName} returned successfully`,
                               };

                          }

                        if (lendInfo == null && findUser.length == 0){
                              throw new Error(`${user.mailId} Does Not Lend Any Books`)

                        }

                        if (lendInfo == null){
                              throw new Error(`${user.mailId} Returned The Book ${bookName}`)
 
                        }

		} catch (e) {
			return {
				status: "ERROR",
				data: null,
				message: e.message,
			};
		}
	});

	fastify.get("/getreturnedbooks", async (req, res) => {
		const getReturnedBooks = await lendRepo.find({where: { returned: true }});
		console.log("TO CHECK THE RETUEN RECORD ->", getReturnedBooks);

		if (getReturnedBooks.length == 0) {
			return {
				status: "ERROR",
				data: null,
				message: "No Books Returned",
			};
		} else {
			return {
				status: "SUCCESS",
				data: getReturnedBooks,
				message: "The Total Returned Books Fetched successfully",
			};
		}
	});

	fastify.get("/getbooksreturnedbyuser", async (req, res) => {
		try {
			const userId = req.body.user.userId;
			console.log("To Check The Input ->", userId);

		
				const checkUser = await lendRepo.findOne({where: { userId } });
				console.log("To Check The Lend Id ->",checkUser);

			        const checkReturns = await lendRepo.find({where: {userId,returned: true,}});

					if (checkUser != null && checkReturns.length != 0) {
						return {
							status: "SUCCESS",
							data: checkReturns,
							message: "User Returns fetched successfully",
						};
					} else if (checkUser == null){
						throw new Error(`User Does Not Lend Any Books`);
					  } else  {
					          throw new Error("User Does Not Returned Any Book");
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
