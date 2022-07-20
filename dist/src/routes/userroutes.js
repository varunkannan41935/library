"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db');
function userroutes(fastify, options, done) {
    fastify.post('/newuser', async (req, res) => {
        const newuser = {
            userName: req.body.userName,
            mailId: req.body.mailId,
            password: req.body.password,
            createdAt: new Date()
        };
        console.log('user Inputs', newuser);
        const users = await fastify.db.userrecords.save(newuser);
        console.log('New user of the library ', users);
        return users;
    });
    fastify.get('/getusers', async (req, res) => {
        const users = await fastify.db.userrecords.find();
        console.log('Users details', users);
        return users;
    });
    fastify.put('/updateuser', async (req, res) => {
        const userId = req.body.userId;
        console.log('Inputs for the user updation', userId);
        const userName = req.body.userName;
        const mailId = req.body.mailId;
        const password = req.body.password;
        const updateuser = await fastify.db.userrecords.update(userId, { userName, mailId, password });
        console.log('updated user credentials', updateuser);
        return updateuser;
    });
    fastify.delete('/deleteuser', async (req, res) => {
        const queryParams = req.query;
        console.log('User deletion query', JSON.stringify(queryParams));
        const deleteuser = await fastify.db.userrecords.delete({ ...queryParams });
        console.log('Deleted user', deleteuser);
        return deleteuser;
    });
}
exports.default = userroutes;
//# sourceMappingURL=userroutes.js.map