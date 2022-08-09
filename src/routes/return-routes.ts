import { getRepository } from "typeorm";
import { Lend } from "../entity/lends";
import { Users } from "../entity/users";
import { Library } from "../entity/books";
import { RequestGenericInterface } from "fastify";
const db = require("../db");

export default function lendRoutes(fastify, options, done) {
	const lendRepo = fastify.db.lendrecords;
	const libRepo = fastify.db.librecords;
        const userRepo = fastify.db.userrecords;

	fastify.post("/returnbook", async (req, res) => {
		try {
			const lendId = req.body.lendId;
			console.log("To Check The Input ->", lendId);

			if (lendId == undefined) {
				throw new Error("Provide Required Input");
			}

			const checkLendId = await lendRepo.findOne({where: { lendId: lendId },});
			console.log("To Check The Lend Id ->", checkLendId);
                   
			if (checkLendId != null &&checkLendId.returned == false) {
				const updatedLendStatus = await lendRepo.update(lendId,{ returned: true });

 				console.log("To Check The Updated Book In Return Record ->",updatedLendStatus);

				return {
					status: "SUCCESS",
					data: updatedLendStatus,
					message: "The  Book Returned successfully",
				};
			} else if (checkLendId != null &&checkLendId.returned == true) {
				throw new Error("The Book Is Already Returned");

			} else {
				throw new Error("The Provided LendId Is Not Valid");
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
		console.log("TO CHECK THE RETUEN RECORD ->",getReturnedBooks);

		if (getReturnedBooks.length == 0) {
			return {
				status: "ERROR",
				data: null,
				message: "No Books Returned ",
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
			const userId = req.query.userId;
			console.log("To Check The Input ->",typeof userId);
                  
                        const id = Number(userId)
                          if(isNaN(id)){
                             throw new Error('Provide Required Input')
                          } else {

                               const findUser = await userRepo.findOne({where:{userId}})
                                 console.log("To Check findUser ->",findUser);             
                                  
                               const checkUser = await lendRepo.findOne({where: { userId }});
                                 console.log("To Check The Lend Id ->",checkUser);

                               if(findUser == null && checkUser == null){
                                     throw new Error( "User Id Not Valid" );
                        
                         } else if ( findUser != null &&  checkUser != null || findUser == null && checkUser !=null) {
     
                          const checkReturns = await lendRepo.find({where:{ userId,returned:true }})

                                     if(checkReturns.length != 0) {
                     
					return {
						status: "SUCCESS",
				 		data: checkReturns,
						message: "User Returns fetched successfully",
					};

				} else {
					throw new Error("User Does Not Returned Any Books");
				  }
                             } else if (findUser != null && checkUser == null){
                                     throw new Error("User Does Not Lend Any Book To Return")
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
	done();
}
