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
fastify.register(library_routes_1.default);
fastify.register(lend_routes_1.default);
fastify.register(user_routes_1.default);
fastify.register(return_routes_1.default);
const jwt = require("jsonwebtoken");
const verifyToken = fastify.addHook("preHandler", (req, res, done) => {
    const token = req.headers.authorization;
    console.log("Token -->", token);
    console.log("Router Path -->", req.routerPath);
    const unauthorizedRoutes = [
        "/usersignin",
        "/usersignup",
        "/globalbooks/postbook",
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
            "/deleteuser",
            "/getlendedbooks",
            "/getreturnedbooks",
        ];
        const decoded = jwt.verify(token, process.env.JWT);
        console.log("Decoded Token -->", decoded);
        var decodedUser = decoded.userInfo;
        const role = decoded.userInfo.role;
        const payload = {};
        req.body = Object.assign(payload, { data: req.body }, { user: decodedUser });
        console.log('REQ BODY -->', req.body);
        console.log("User -->", decodedUser);
        if (adminRoutes.includes(req.routerPath) && role == 'user') {
            console.log('-- To Check the Route ->', role);
            done(new Error('Unauthorized User'));
        }
        done();
    }
});
const port = 3001;
fastify.listen(port, (err, address) => {
    if (err) {
        fastify.log.error("ERROR", err);
        process.exit(1);
    }
    console.log(`Server started listening at ${address}`);
});
//# sourceMappingURL=server.js.map