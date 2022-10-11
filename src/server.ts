const fastify = require("fastify")({
	logger: true,
	requestIdLogLabel: "reqId",
});

import { Library } from "./entity/books";
import { Lend } from "./entity/lends";
import { Users } from "./entity/users";
import * as dotenv from "dotenv";

import db from "./db";
import libraryRoutes from "./routes/library-routes";
import lendRoutes from "./routes/lend-routes";
import userRoutes from "./routes/user-routes";
import returnRoutes from "./routes/return-routes";

fastify.register(db);
fastify.register(libraryRoutes);
fastify.register(lendRoutes);
fastify.register(userRoutes);
fastify.register(returnRoutes);

const jwt = require("jsonwebtoken");

const verifyToken = fastify.addHook("preHandler", (req, res, done) => {

	const token = req.headers.authorization;

	console.log("Token -->", token );
 	console.log("Router Path -->", req.routerPath);

        const unauthorizedRoutes = [
		"/usersignin",
                "/usersignup",
		"/globalbooks/postbook",
	];

        if(unauthorizedRoutes.includes(req.routerPath)){
               done();
        }
          else{


		const adminRoutes = [
			"/postbook",
			"/updatebook",
			"/deletebook",
                        "/getusers",
                        "/deleteuser",
                        "/getlendedbooks",
                        "/getreturnedbooks",
		];
                

		const decoded = jwt.verify(token,process.env.JWT);
		console.log("Decoded Token -->", decoded);


                var decodedUser = decoded.userInfo;
                const role = decoded.userInfo.role;
                const payload = {};
                req.body = Object.assign(payload, {data: req.body}, {user: decodedUser}, );     
  

                console.log('REQ BODY -->',req.body)
                console.log("User -->",decodedUser);
                 
               if(adminRoutes.includes(req.routerPath) && role == 'user'){

                 console.log('-- To Check the Route ->',role)
                     done(new Error ('Unauthorized User'));
               }
               done();
          }

});

const port = 3001;
fastify.listen(port, (err, address) => {
	if (err) {
		fastify.log.error("ERROR", err);
		process.exit(1);
	}
	console.log(`Server started listening at ${address}`);
});
