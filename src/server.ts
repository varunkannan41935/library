const fastify = require("fastify")({
	logger: true,
	requestIdLogLabel: "reqId",
});

import { Library } from "./entity/books";
import { Lend } from "./entity/lends";
import { Users } from "./entity/users";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import db from "./db";
import libraryRoutes from "./routes/library-routes";
import lendRoutes from "./routes/lend-routes";
import userRoutes from "./routes/user-routes";
import returnRoutes from "./routes/return-routes";
import { routes, unauthorizedRoutes, adminRoutes } from "./rts"

fastify.register(db);
fastify.register(libraryRoutes);
fastify.register(lendRoutes);
fastify.register(userRoutes);
fastify.register(returnRoutes);

/*fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
   console.log('content type parser data : ',req, body); 
       
    var json = JSON.parse(body)
  
  console.log('parsed json data: ',json)
  
    done(null, json)
})*/


fastify.addHook("preHandler", (req, res, done) => {
	
	const token = req.headers.authorization;

	console.log("Token: ", token );
	console.log("URL: ",req.url);
        console.log('req body: ',req.body)
        console.log('request object: ',req);
        console.log('headers',req.headers);
 	
	if(routes.includes(req.url) && !token ){
                res.send({
                        statuscode: 500,
                        error: 'Missing JWT Token',
                        message: 'Provide valid JWT Token',
                });
	}

        if(unauthorizedRoutes.includes(req.url)){


		console.log('unauthorized route : ',req.url);
                console.log(`unauthorized route's data:`,req.body, req.query, req.params )   
		done();
        }

      	  else {
		
		console.log("Token: ", {token});
                console.log('prehandler req Object: ',req);
		console.log('request url: ',req.url)
		const decoded = jwt.verify(token,process.env.JWT, (err, decoded) => {
                                if (err)
                                return false;

                                return decoded;
                                });
		console.log("Decoded Token -->", decoded);
   
		if(decoded == false)
			res.send({
                            error: 'JWT Token misformed/expired',
			})

                var decodedUser = decoded.user;
                console.log("User: ",decodedUser);

		const role = decoded.user.role;
                const payload = {};
                req.body = Object.assign(payload, {data: req.body}, {user: decodedUser}, );     
  
                console.log('req body after adding token data: ',req.body)
                 
               if(adminRoutes.includes(req.url) && role == 'user'){

                 console.log('-- To Check the Route ->',role)
                     done(new Error ('Unauthorized User'));
               }
               done();
         }
});

fastify.get('/healthcheck',async(req,res) => {
       console.log(req.hostname);

	return `Server Started Listening At ${req.hostname}`;
});

fastify.listen(process.env.PORT || 3001, '0.0.0.0', function (err, address) {
	if (err) {
		fastify.log.error("ERROR", err);
		process.exit(1);
	}
	console.log(`Server started listening at ${address}`)
	console.log('registered Routes: ',fastify.printRoutes());
});

