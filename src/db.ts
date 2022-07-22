import "reflect-metadata"
import fp from "fastify-plugin"

import { Library } from "./entity/books"
import { Lend }    from "./entity/lends"
import { Users }   from "./entity/users"
import { Return }  from "./entity/returns"

import {createConnection,getConnectionOptions} from "typeorm"

export default fp(async server =>{
 try {
   const connectionOptions = await getConnectionOptions()
    Object.assign(connectionOptions,{
     synchronize: true,
      entities: [Library,Lend,Users,Return]
    })
    const connection = await createConnection(connectionOptions)
    console.log("connected to db")

    server.decorate("db", {
       library: connection.getRepository(Library),
        lendrecords: connection.getRepository(Lend),
         userrecords: connection.getRepository(Users),
          returnrecords: connection.getRepository(Return)
    } )
 }
   catch (error) {
   console.log('ERROR -> ', error)
   console.log("unable to connect to db")
  }
})
