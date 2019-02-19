'use strict';

module.exports = {
    rethinkdb: {
        //host: "172.17.0.3",
        host: process.env.DB_HOST,
        //db host
        port: process.env.DB_PORT,
        authKey: "",
        db: process.env.DB_NAME,
    },
    tables: [{
        table: "users",
        id: "userId"
    }, {
        table: "url_maps",
        id: "shortId"
    }
    ]
}
