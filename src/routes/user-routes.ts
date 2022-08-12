import { getRepository } from "typeorm";
import { Users } from "../entity/users";
import { RequestGenericInterface } from "fastify";
const db = require("../db");

export default function userRoutes(fastify, options, done) {
	const userRepo = fastify.db.userrecords;

	fastify.post("/newuser", async (req, res) => {
		try {
			const newUser = {
				userName: req.body.userName,
				mailId: req.body.mailId,
				password: req.body.password,
			};

			console.log("Inputs for user ->", newUser);

			if (JSON.stringify(newUser) === "{}") {
				throw new Error("Invalid Input : Provide The Neccessary Input Data");
			}

			Object.entries(newUser).forEach((entry) => {
				const [newUserKey, newUserValue] = entry;
				console.log("post user->", entry);

				if (typeof newUserValue !== "string" || newUserValue == null) {
					throw new Error("Invallid Input : Provide Required Input");
				}
			});

			const userInfo = await userRepo.findOne({where: { mailId: newUser.mailId }});

			if (userInfo == null) {
				const users = await userRepo.save(newUser);

				console.log("New user of the library ", users);
				return {
					status: "SUCCESS",
					data: users,
					message: "The User created successfully",
				};
			} else {
				throw new Error(
					"The Provided MailId Is Already In Use"
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

	fastify.get("/getusers", async (req, res) => {
		const users = await userRepo.find();
		console.log("Users details", users);

		if (users.length != 0) {
			return {
				status: "SUCCESS",
				data: users,
				message: "The Users Fetched successfully",
			};
		} else {
			return {
				status: "ERROR",
				data: null,
				message: "There Are No Users Available",
			};
		}
	});

	fastify.put("/updateuser", async (req, res) => {
		try {
			const userId = req.body.userId;
			console.log("UserId for the user updation ->", userId);

			if (typeof userId !== "number" || !userId) {
				throw new Error("Invalid Input : Provide The Required Input For userId");
			}

			const newUser = {
				userName: req.body.userName,
				mailId: req.body.mailId,
				password: req.body.password,
			};

			console.log("Inputs for the user updation ->", newUser);

			if (JSON.stringify(newUser) === "{}") {
				throw new Error(
					"Invalid Input : Provide the Required Inputs For User Updation"
				);
			}

			Object.entries(newUser).forEach((entry) => {
				const [newUserKey, newUserValue] = entry;

				if ( newUserValue != undefined && newUserValue != null) {
					var UserArr = [newUserKey,newUserValue,];
					console.log("Iterated Object Values ->",newUserValue);

					if (typeof newUserValue !== "string" || newUserValue == "" ||newUserValue == null ) {
						throw new Error("Invalid Input : Provide Required Input");
					}
				}
			});

			const findUser = await userRepo.findOne({ where: { userId: userId } });

			if (findUser != null) {
				const updateUser = await userRepo.update(userId,{ ...newUser });
				console.log("updated user credentials ->",updateUser);

				return {
					status: "SUCCESS",
					data: updateUser,
					message: "The User updated successfully",
				};
			} else {
				throw new Error("The User Is Not Found");
			}
		} catch (e) {
			return {
				status: "ERROR",
				data: null,
				message: e.message,
			};
		}
	});

	fastify.delete("/deleteuser", async (req, res) => {
		try {
			const userId = req.query.userId;
			console.log("User deletion query ->", Number(userId));

			if ( typeof userId == "string" && Number(userId) == NaN ) {
				throw new Error("Provide The Required Input For The Book Deletion");
			} else {
				const userInfo = await userRepo.findOne({where: { userId: userId } });
				console.log("find user", userInfo);

				if (userInfo != null) {
					const deleteUser =await userRepo.delete(userInfo);
					console.log("Deleted user ->",deleteUser);

					return {
						status: "SUCCESS",
						data: deleteUser,
						message: "The User Deleted successfully",
					};
				} else {
					throw new Error("The User Is Not Available");
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
