"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require("fastify")({
    logger: true,
    requestIdLogLabel: "reqId",
});
const db_1 = __importDefault(require("./db"));
const library_routes_1 = __importDefault(require("./routes/library-routes"));
const lend_routes_1 = __importDefault(require("./routes/lend-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const return_routes_1 = __importDefault(require("./routes/return-routes"));
fastify.register(db_1.default);
const jwt = require("jsonwebtoken");
require('dotenv').config;
const verifyToken = fastify.addHook("preHandler", (req, res, done) => {
    const token = req.headers.authorization;
    console.log("HEADERS -->", req.headers);
    console.log("Token -->", { token });
    console.log("route -->", req.routerPath);
    const unauthorizedRoutes = [
        "/usersignin",
        "/usersignup",
        "/updateuser",
        "/login/google",
        "/login/google/callback",
    ];
    if (unauthorizedRoutes.includes(req.routerPath)) {
        done();
    }
    else {
        const adminRoutes = [
            "/postbook",
            "/updatebook",
            "/deletebook",
            "/getusers",
            "/deleteusers",
            "/getlendedbooks",
            "/getreturnedbooks",
            "/issuebook",
            "/addadmin",
            "/changerole",
        ];
        const decoded = jwt.verify(token, process.env.JWT);
        console.log("Decoded Token -->", decoded.userInfo);
        var decodedUser = decoded.userInfo;
        const role = decoded.userInfo.role;
        const payload = {};
        Object.assign(payload, { data: req.body });
        Object.assign(payload, { user: decodedUser });
        req.body = payload;
        console.log('REQ BODY ! -->', req.body);
        console.log("User ->", decodedUser);
        console.log("new payload data -->", payload);
        console.log("Route -->", req.routerPath);
        if (adminRoutes.includes(req.routerPath) && decoded.userInfo.role == 'user') {
            console.log('-- To Check the Route ->', decoded.userInfo.role);
            done(new Error('Unauthorized User'));
        }
        done();
    }
});
fastify.register(library_routes_1.default);
fastify.register(lend_routes_1.default);
fastify.register(user_routes_1.default);
fastify.register(return_routes_1.default);
fastify.listen(3001, (err, address) => {
    if (err) {
        fastify.log.error("ERROR", err);
        process.exit(1);
    }
    console.log(`Server started listening at ${address}`);
});
//# sourceMappingURL=server.js.map