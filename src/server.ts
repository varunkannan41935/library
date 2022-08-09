const fastify = require('fastify')({logger:true})

import { Library } from "./entity/books";
import { Lend } from "./entity/lends";
import { Users } from "./entity/users";

import db from './db';
import libraryRoutes from './routes/library-routes';
import lendRoutes from './routes/lend-routes'; 
import userRoutes from './routes/user-routes';
import returnRoutes from './routes/return-routes';

fastify.register(db);
fastify.register(libraryRoutes);
fastify.register(lendRoutes);
fastify.register(userRoutes);
fastify.register(returnRoutes);

fastify.listen(3001,(err, address)=>{

if(err){
fastify.log.error('ERROR', err)
process.exit(1)
 }
console.log(`Server started listening at ${address}`);
});

 
