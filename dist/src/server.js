"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require('fastify')({ logger: true });
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("./routes/routes"));
const lendroutes_1 = __importDefault(require("./routes/lendroutes"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
fastify.register(db_1.default);
fastify.register(routes_1.default);
fastify.register(lendroutes_1.default);
fastify.register(userroutes_1.default);
fastify.listen(3001, '0.0.0.0', (err, address) => {
    if (err) {
        fastify.log.error('ERROR', err);
        process.exit(1);
    }
    console.log(`Server started listening at ${address}`);
});
//# sourceMappingURL=server.js.map