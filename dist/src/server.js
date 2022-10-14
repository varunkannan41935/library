"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require("fastify")({
    logger: true,
    requestIdLogLabel: "reqId",
});
const jwt = __importStar(require("jsonwebtoken"));
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
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    console.log('content type parser data --------: ', req, body);
    var json = JSON.parse(body);
    console.log('parsed json data: ', json);
    done(null, json);
});
fastify.addHook("preHandler", (req, res, done) => {
    const token = req.headers.authorization;
    console.log("Token: ", token);
    console.log("URL: ", req.url);
    console.log('req body: ', req.body);
    console.log('request object: ', req);
    console.log('headers', req.headers);
    console.log('req parse', JSON.parse(req));
    if (rts_1.validRouterPath.includes(req.url) && !token) {
        res.send({
            statuscode: 500,
            error: 'Missing JWT Token',
            message: 'Provide valid JWT Token',
        });
    }
    if (rts_1.unauthorizedRoutes.includes(req.url)) {
        console.log('unauthorized route -----------------------------------------------------: ', req.url);
        console.log(`unauthorized route's data-----------------------------------------------:`, req.body, req.headers);
        done();
    }
    else {
        console.log("Token: ", { token });
        console.log("------------------------------------");
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
fastify.post('/checkroute', async (req, res) => {
    const data = {
        bookName: req.body.bookName,
        authorName: req.body.authorName,
        language: req.body.language,
        genre: req.body.genre,
        donatedBy: req.body.donatedBy,
        createdAt: Date(),
    };
    const saveBook = await fastify.db.library.save(data);
    console.log('To Check -->', saveBook);
    return {
        status: "SUCCESS",
        data: saveBook,
    };
});
fastify.listen(process.env.PORT || 3001, '0.0.0.0', function (err, address) {
    if (err) {
        fastify.log.error("ERROR", err);
        process.exit(1);
    }
    console.log(`Server started listening at ${address}`);
    console.log('registered Routes: ', fastify.printRoutes());
});
//# sourceMappingURL=server.js.map