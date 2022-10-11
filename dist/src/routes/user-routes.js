"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const db = require("../db");
const jwt = require("jsonwebtoken");
function userRoutes(fastify, options, done) {
    const userRepo = fastify.db.userrecords;
    fastify.post("/usersignin", async (req, res) => {
        try {
            const newUser = {
                mailId: req.body.mailId,
                password: req.body.password,
                role: "user",
                createdAt: Date(),
            };
            newUser.password = await bcrypt.hash(newUser.password, 8);
            console.log('NEW USER', newUser);
            Object.entries(newUser).forEach((entry) => {
                const [newUserKey, newUserValue] = entry;
                if (typeof newUserValue !== "string" || newUserValue == undefined || newUserValue.length == 0) {
                    throw new Error("Invalid Input : Provide Required Input");
                }
            });
            const userInfo = await userRepo.findOne({ where: { mailId: newUser.mailId } });
            if (userInfo == null) {
                const users = await userRepo.save(newUser);
                console.log("New user of the library --->", users);
                return {
                    status: "SUCCESS",
                    data: users,
                    message: "The User registered successfully",
                };
            }
            else {
                throw new Error("The Provided MailId Is Already In Use");
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
    fastify.post("/usersignup", async (req, res) => {
        try {
            const newUser = {
                mailId: req.body.mailId,
                password: req.body.password,
            };
            console.log("Input ->", newUser);
            Object.entries(newUser).forEach((entry) => {
                const [newUserKey, newUserValue] = entry;
                if (typeof newUserValue !== "string" || newUserValue == undefined) {
                    throw new Error("Invalid Input : Provide Required Input");
                }
            });
            const userInfo = await userRepo.findOne({ where: { mailId: newUser.mailId } });
            if (!userInfo) {
                throw new Error("Invalid Credential : Invalid MailId");
            }
            else {
                const passwordCompare = await bcrypt.compare(newUser.password, userInfo.password);
                console.log("To Check User info", passwordCompare);
                if (passwordCompare === true) {
                    const token = jwt.sign({ userInfo }, process.env.JWT, { expiresIn: "86400s" });
                    console.log('TOKEN -->', { token });
                    return {
                        status: "SUCCESS",
                        data: { token },
                    };
                }
                else {
                    throw new Error("Invalid Input : Invalid Password");
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
    /**fastify.post("/usersignin", async (req, res) => {
    
               const token = req.headers.authorization;
  
        const decodedToken = jwt.verify(token,secret_key);
 
                const user = {
                             mailId : decodedToken.email,
                             role :  'user',
                             createdAt : Date(),
                            
                };
 
                const user = {
                             mailId: req.body.mailId,
                             role: 'user',
                             createdAt : Date(),
                };
                console.log('USER', user)
                let token = {};
           
 
                const findUser = await userRepo.findOne({where: {mailId : user.mailId}})
                console.log('TO FIND THE USER IS ALREADY IN DB --->',findUser);
                
                if (findUser == null) {

                const addUser = await userRepo.save(user);
                console.log('NEW USER  ------->',addUser);
                
                token = jwt.sign({ user : addUser },process.env.JWT,{ expiresIn: "86400s" });
                console.log('TOKEN -->',{ token });


                } else {

                       const updateVisit = await userRepo.update(findUser.userId,{visitCount : findUser.visitCount + 1})

                       token = jwt.sign({ user : findUser },process.env.JWT,{ expiresIn: "86400s" });
                       console.log('TOKEN -->',{ token });
                 
                  }

                 console.log("TOKEN -------->",token)


                return {
                       status : 'SUCCESS',
                       data : token
                }
            
    });**/
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