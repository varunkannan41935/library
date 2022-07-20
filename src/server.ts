const fastify = require('fastify')({logger:true})

import { Library } from "./entity/books";
import { Lend } from "./entity/lendrecords";
import { Users } from "./entity/users";

import db from './db';
import libraryroutes from './routes/routes';
import lendroutes from './routes/lendroutes'; 
import userroutes from './routes/userroutes';

fastify.register(db);
fastify.register(libraryroutes);
fastify.register(lendroutes);
fastify.register(userroutes);

fastify.listen(3001, '0.0.0.0',(err, address)=>{

if(err){
fastify.log.error('ERROR', err)
process.exit(1)
 }
console.log(`Server started listening at ${address}`);
});

 
