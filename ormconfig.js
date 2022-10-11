module.exports = {
	production: false,
        type: "postgres",
	port: 5432,
	host: "localhost",
	username: "postgres",
	password: "root",
        database: "postgres",
	logging: false
}

module.exports = {
	production: true,
        type: "postgres",
        port: process.env.DBPORT,
        host: process.env.HOST,
        username: process.env.DBUSERNAME,
        password: process.env.DBPASS,
        database: process.env.DBNAME,,
        logging: false
}
