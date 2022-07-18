import "reflect-metadata"
import fp from "fastify-plugin"
import { Library } from "./entity/books"
import { Lend } from "./entity/lendrecords"
import {createConnection,getConnectionOptions} from "typeorm"

export default fp(async server =>{
 try {
   const connectionOptions = await getConnectionOptions()
    Object.assign(connectionOptions,{
     synchronize: true,
      entities: [Library,Lend]
    })
    const connection = await createConnection(connectionOptions)
    console.log("connected to db")

    server.decorate("db", {
       library: connection.getRepository(Library),
        lendrecords: connection.getRepository(Lend)
    } )
 }
   catch (error) {
   console.log('ERROR -> ', error)
   console.log("unable to connect to db")
  }
})
