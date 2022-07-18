"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify = require('fastify')({ logger: true });
fastify.get('/', (req, res) => {
    res.send("Hello World");
});
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map