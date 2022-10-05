"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
function userRoutes(fastify, options, done) {
    const userRepo = fastify.db.userrecords;
    fastify.post("/usersignin", async (req, res) => {
        try {
            const newUser = {
                mailId: req.body.mailId,
                password: req.body.password,
                role: "user",
            };
            newUser.password = await bcryptjs_1.default.hash(newUser.password, 8);
            console.log("Hashed Password ->", newUser.password);
            console.log('mailId', typeof newUser.mailId);
            Object.entries(newUser).forEach((entry) => {
                const [newUserKey, newUserValue] = entry;
                if (typeof newUserValue !== "string" || newUserValue == undefined || entry[1] == 0) {
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
                console.log("post user->", entry);
                if (typeof newUserValue !== "string" || newUserValue == undefined) {
                    throw new Error("Invalid Input : Provide Required Input");
                }
            });
            const userInfo = await userRepo.findOne({ where: { mailId: newUser.mailId } });
            if (!userInfo) {
                throw new Error("Invalid Credential : Invalid MailId");
            }
            else {
                const passwordCompare = await bcryptjs_1.default.compare(newUser.password, userInfo.password);
                console.log("To Check User info", passwordCompare);
                console.log("Input Password -->", newUser.password);
                console.log("Hashed Password In The DB -->", userInfo.password);
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
    fastify.put("/updateuser", async (req, res) => {
        try {
            var user = {
                mailId: req.body.mailId,
                password: req.body.password,
            };
            console.log("Input For Updation", user);
            user.password = await bcryptjs_1.default.hash(user.password, 8);
            console.log("Hashed Password ->", user.password);
            const findUser = await userRepo.findOne({ where: { mailId: user.mailId }, });
            console.log("To find the user in the db -->", findUser, user.mailId);
            if (findUser != null) {
                const updateUser = await userRepo.update(findUser.userId, { password: user.password });
                console.log("updated user credentials ->", updateUser);
                return {
                    status: "SUCCESS",
                    data: updateUser,
                    message: `The User's password updated successfully`,
                };
            }
            else {
                throw new Error("The User Is Not Found");
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
    fastify.get("/getusers", async (req, res) => {
        const users = await userRepo.find();
        console.log("Users details", users);
        if (users.length != 0) {
            return {
                status: "SUCCESS",
                data: users,
                message: "The Users Fetched successfully",
            };
        }
        else {
            return {
                status: "ERROR",
                data: null,
                message: "There Are No Users Available",
            };
        }
    });
    fastify.delete("/deleteuser", async (req, res) => {
        try {
            const mailId = req.query.mailId;
            if (!mailId || typeof mailId != "string") {
                throw new Error("Invalid Input : Provide Required Input");
            }
            const findUser = await userRepo.findOne({ where: { mailId } });
            console.log("To Find The User ->", findUser);
            if (findUser != null) {
                const deleteUser = await userRepo.delete({ mailId });
                return {
                    status: "SUCCESS",
                    data: deleteUser,
                    message: `The User Deleted Successfully`,
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
    /**fastify.post("/addadmin", async (req, res) => {
        try {
            const adminInfo = {
                mailId: req.body.data.mailId,
                password: "password",
                role: "admin",
            };

            adminInfo.password = await bcrypt.hash(adminInfo.password,8);
            console.log("Hashed Password ->", adminInfo.password);

            Object.entries(adminInfo).forEach((entry) => {
                const [key, value] = entry;
                console.log(`Input values ->`, value);

                if (typeof value !== "string" || value == undefined) {
                    throw new Error("Invalid Input : Provide Required Input");
                }
            });

            const admin = await userRepo.save(adminInfo);
            console.log("Admin ->", admin);

            return {
                status: "SUCCESS",
                data: admin,
                message: `${adminInfo.mailId} Successfully Added as Admin`,
            };
        } catch (e) {
            return {
                status: "ERROR",
                data: null,
                message: e.message,
            };
        }
    });

    fastify.post("/updaterole", async (req, res) => {
        try {
            const user = req.body.data.mailId;
            console.log("user whose role to be changed ->", user);

            const findUser = await userRepo.findOne({where: { mailId: user },});
            console.log("To find the user ->", findUser);

            if (findUser != null) {
                const updatedRole = await userRepo.update(findUser.userId,{ role: "admin" });

                return {
                    status: "SUCCESS",
                    data: updatedRole,
                    message: `user ${user} role updated successfully`,
                };
            } else {
                throw new Error(`user ${user} is unidentified`);
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
exports.default = userRoutes;
//# sourceMappingURL=user-routes.js.map