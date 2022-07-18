"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const books_1 = require("../entity/books");
const adminentity_1 = require("../entity/adminentity");
const typeorm_1 = require("typeorm");
exports.default = (0, fastify_plugin_1.default)(async (server) => {
    try {
        const connectionOptions = await (0, typeorm_1.getConnectionOptions)();
        Object.assign(connectionOptions, {
            synchronize: true,
            entities: [books_1.Library, adminentity_1.Admins]
        });
        const connection = await (0, typeorm_1.createConnection)(connectionOptions);
        console.log("connected to db");
        server.decorate("db", {
            library: connection.getRepository(books_1.Library),
            adminrepo: connection.getRepository(adminentity_1.Admins)
        });
    }
    catch (error) {
        console.log('ERROR -> ', error);
        console.log("unable to connect to db");
    }
});
//# sourceMappingURL=libdb.js.map