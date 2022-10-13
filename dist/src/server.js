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
const rts_1 = require("./rts");
fastify.register(db_1.default);
fastify.register(library_routes_1.default);
fastify.register(lend_routes_1.default);
fastify.register(user_routes_1.default);
fastify.register(return_routes_1.default);
const jwt = require("jsonwebtoken");
const verifyToken = fastify.addHook("preHandler", (req, res, done) => {
    const token = req.headers.authorization;
    console.log("Token: ", token);
    console.log("req Params: ", req.params);
    console.log("routerPath: ", req.url);
    console.log('CONFIG: ', req.context.config);
    console.log('req body before token data: ', req.body);
    console.log('request object: ', req);
    if (rts_1.validRouterPath.includes(req.url) && !token) {
        res.send({
            statuscode: 500,
            error: 'Missing JWT Token',
            message: 'Provide valid JWT Token',
        });
    }
    if (rts_1.unauthorizedRoutes.includes(req.url)) {
        console.log('unauthorized route: ', req.url);
        done();
    }
    else {
        console.log("Token: ", { token });
        console.log("");
        const decoded = jwt.verify(token, process.env.JWT, (err, decoded) => {
            if (err)
                return false;
            return decoded;
        });
        console.log("Decoded Token -->", decoded);
        if (decoded == false)
            res.send({
                error: 'JWT Token misformed/expired',
            });
        var decodedUser = decoded.user;
        const role = decoded.user.role;
        const payload = {};
        req.body = Object.assign(payload, { data: req.body }, { user: decodedUser });
        console.log('req body after adding token data: ', req.body);
        console.log("User: ", decodedUser);
        if (rts_1.adminRoutes.includes(req.url) && role == 'user') {
            console.log('-- To Check the Route ->', role);
            done(new Error('Unauthorized User'));
        }
        done();
    }
});
fastify.get('/healthcheck', async (req, res) => {
    console.log(req.hostname);
    return `Server Started Listening At ${req.hostname}`;
});
fastify.listen(process.env.PORT || 3001, '0.0.0.0', function (err, address) {
    if (err) {
        fastify.log.error("ERROR", err);
        process.exit(1);
    }
    console.log(`Server started listening at ${address}`);
    console.log('registered Routes: ', fastify.printRoutes());
    console.log(address);
});
//# sourceMappingURL=server.js.map