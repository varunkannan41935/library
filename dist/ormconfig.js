module.exports = {
    production: true,
    type: "postgres",
    port: process.env.DBPORT,
    host: process.env.HOST,
    username: process.env.DBUSERNAME,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    logging: false
};
//# sourceMappingURL=ormconfig.js.map