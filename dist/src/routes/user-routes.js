"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const db = require("../db");
const jwt = require("jsonwebtoken");
function userRoutes(fastify, options, done) {
    const userRepo = fastify.db.userrecords;
    console.log('verifying whether the control flows through User Routes');
    fastify.post("/usersignin", async (req, res) => {
        /** const token = req.headers.authorization;

  const decodedToken = jwt.verify(token,secret_key);

          const user = {
                       mailId : decodedToken.email,
                       role :  'user',
                       createdAt : Date(),
                      
          };**/
        const user = {
            mailId: req.body.mailId,
            role: 'user',
            createdAt: Date(),
        };
        console.log('USER', user);
        let token = {};
        const findUser = await userRepo.findOne({ where: { mailId: user.mailId } });
        console.log('to find whether the user info is already in db: ', findUser);
        if (findUser == null) {
            const addUser = await userRepo.save(user);
            console.log('newly added user to db: ', addUser);
            if (user.mailId == 'anoop@surfboard.se') {
                const updateUser = await userRepo.update(addUser.userId, { role: 'admin' });
            }
            token = jwt.sign({ user: addUser }, process.env.JWT, { expiresIn: "86400s" });
            console.log('auth token: ', { token });
        }
        else {
            const updateVisit = await userRepo.update(findUser.userId, { visitCount: findUser.visitCount + 1 });
            token = jwt.sign({ user: findUser }, process.env.JWT, { expiresIn: "86400s" });
            console.log('auth token: ', { token });
        }
        return {
            status: 'SUCCESS',
            data: token
        };
    });
    fastify.get("/getusers", async (req, res) => {
        const findUsers = await userRepo.find();
        console.log('AVAILABLE USERS --->', findUsers);
        if (findUsers.length != 0) {
            return {
                status: 'SUCCESS',
                data: findUsers,
                message: 'The Users fetched Successfully'
            };
        }
    });
    fastify.delete("/deleteuser", async (req, res) => {
        try {
            const mailId = req.query.mailId;
            console.log('user to be deleted --->', mailId);
            if (!mailId || typeof mailId != "string") {
                throw new Error("Invalid Input : Provide Required Input");
            }
            const findUser = await userRepo.findOne({ where: { mailId } });
            console.log("To Find The User ->", findUser);
            if (findUser != null) {
                const deleteUser = await userRepo.delete({ mailId });
                return {
                    status: "SUCCESS",
                    data: findUser,
                    message: `The User ${findUser.mailId} Deleted Successfully`,
                };
            }
            else {
                throw new Error("User Not Found");
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
exports.default = userRoutes;
//# sourceMappingURL=user-routes.js.map