"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require('fastify')({ logger: true });
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
fastify.listen(3001, (err, address) => {
    if (err) {
        fastify.log.error('ERROR', err);
        process.exit(1);
    }
    console.log(`Server started listening at ${address}`);
});
//# sourceMappingURL=server.js.map