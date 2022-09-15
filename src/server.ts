const fastify = require("fastify")({
	logger: true,
	requestIdLogLabel: "reqId",
});

import { Library } from "./entity/books";
import { Lend } from "./entity/lends";
import { Users } from "./entity/users";

import db from "./db";
import libraryRoutes from "./routes/library-routes";
import lendRoutes from "./routes/lend-routes";
import userRoutes from "./routes/user-routes";
import returnRoutes from "./routes/return-routes";

fastify.register(db);

const jwt = require("jsonwebtoken");
require('dotenv').config;

//export var decodedUser;

const verifyToken = fastify.addHook("preHandler", (req, res, done) => {

	const token = req.headers.authorization;

	console.log("HEADERS -->", req.headers);
	console.log("Token -->", { token });
	console.log("route -->", req.routerPath);
	
        const unauthorizedRoutes = [
		"/usersignin",
		"/usersignup",
                
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
                        "/deleteusers",
                        "/getlendedbooks",
                        "/getreturnedbooks",
                        "/issuebook",
                        "/addadmin",
                        "/changerole",
		];
		const decoded = jwt.verify(token,process.env.JWT);
		console.log("Decoded Token -->", decoded.userInfo);
                var decodedUser = decoded.userInfo;
                const role = decoded.userInfo.role;
                const payload = {};
                Object.assign(payload, {data: req.body}); 
                Object.assign(payload, {user: decodedUser});     
  
                req.body = payload;
                console.log('REQ BODY ! -->',req.body)
                console.log("User ->",decodedUser);
                console.log("new payload data -->",payload);
                console.log("Route -->", req.routerPath);
                 
                if(adminRoutes.includes(req.routerPath) && decoded.userInfo.role == 'user'){

                 console.log('-- To Check the Route ->',decoded.userInfo.role)
                     done(new Error ('Unauthorized User'));
                }
               done(null,payload);
          }

});

fastify.register(libraryRoutes);
fastify.register(lendRoutes);
fastify.register(userRoutes);
fastify.register(returnRoutes);

fastify.listen(3001, (err, address) => {
	if (err) {
		fastify.log.error("ERROR", err);
		process.exit(1);
	}
	console.log(`Server started listening at ${address}`);
});
