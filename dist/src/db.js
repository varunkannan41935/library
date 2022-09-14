"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const books_1 = require("./entity/books");
const lends_1 = require("./entity/lends");
const users_1 = require("./entity/users");
const typeorm_1 = require("typeorm");
exports.default = (0, fastify_plugin_1.default)(async (server) => {
    try {
        const connectionOptions = await (0, typeorm_1.getConnectionOptions)();
        Object.assign(connectionOptions, {
            synchronize: true,
            entities: [books_1.Library, lends_1.Lend, users_1.Users],
        });
        const connection = await (0, typeorm_1.createConnection)(connectionOptions);
        console.log("connected to db");
        server.decorate("db", {
            library: connection.getRepository(books_1.Library),
            lendrecords: connection.getRepository(lends_1.Lend),
            userrecords: connection.getRepository(users_1.Users),
        });
    }
    catch (error) {
        console.log("ERROR -> ", error);
        console.log("unable to connect to db");
    }
});
//# sourceMappingURL=db.js.map