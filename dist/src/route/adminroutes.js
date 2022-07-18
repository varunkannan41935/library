"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../db/libdb');
function adminroutes(fastify, options, done) {
    fastify.get('/getadmins', (req, res) => {
        const admins = fastify.db.adminrepo.find();
        return (admins);
    });
    fastify.post('/registeradmin', (req, res) => {
        const admin = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
        const newadmin = fastify.db.adminrepo.save(admin);
        console.log('admin', newadmin);
        return ('New Admin created');
    });
    done();
}
exports.default = adminroutes;
;
//# sourceMappingURL=adminroutes.js.map