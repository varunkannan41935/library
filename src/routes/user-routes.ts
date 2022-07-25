import { getRepository } from "typeorm";
import { Users } from "../entity/users";
import { RequestGenericInterface } from "fastify";
const db = require("../db");

export default function userRoutes(fastify, options, done) {
	const userRepo = fastify.db.userrecords;

	fastify.post("/newuser", async (req, res) => {
		const newUser = {
			userName: req.body.userName,
			mailId: req.body.mailId,
			password: req.body.password,
			createdAt: new Date(),
		};

		console.log("user Inputs", newUser);

		const userInfo = await userRepo.findOne({where: { mailId: newUser.mailId }});

		if (userInfo == null) {
			const users = await userRepo.save(newUser);
			console.log("New user of the library ", users);
			return users;
		} else {
			throw new Error("Provided EmailId is already in use");
		}
	});

	fastify.get("/getusers", async (req, res) => {
		const users = await userRepo.find();
		console.log("Users details", users);
		return users;
	});

	fastify.put("/updateuser", async (req, res) => {
		const userId = req.body.userId;
		console.log("Inputs for the user updation", userId);

		const userName = req.body.userName;
		const mailId = req.body.mailId;
		const password = req.body.password;

		const updateuser = await userRepo.update(userId, {
			userName,
			mailId,
			password,
		});
		console.log("updated user credentials", updateuser);

		return updateuser;
	});

	fastify.delete("/deleteuser", async (req, res) => {
		const queryParams = req.query;
		console.log("User deletion query", JSON.stringify(queryParams));
               
                 const userInfo = await userRepo.findOne({where: { ...queryParams }});
                    if (userInfo != null){
		const deleteuser = await userRepo.delete({ ...queryParams });
		console.log("Deleted user", deleteuser);

		return deleteuser;}
                    else{throw new Error('The user is not found')}
	});

	done();
}
