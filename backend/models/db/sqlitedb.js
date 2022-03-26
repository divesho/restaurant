const sqlite3 = require('sqlite3').verbose();
var conn;

exports.openDBConnection = () => {
    conn = new sqlite3.Database('./db/restaurants.db', 'SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_FULLMUTEX', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the restaurants database.');
    });

    return conn;
}

exports.closeDBConnection = () => {
    conn.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

exports.createTables = () => {
    if (!conn) {
        console.log('no db connection');
        return "db connection failed"
    }

    let categoryTable = 'CREATE TABLE category ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'name TEXT NOT NULL'
        + ');';
    let menuTable = 'CREATE TABLE menu ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'cid TEXT NOT NULL,'
        + 'item TEXT NOT NULL,'
        + 'shortdesc TEXT NOT NULL,'
        + 'fullprice TEXT NOT NULL,'
        + 'halfprice TEXT NOT NULL,'
        + 'foodtype TEXT NOT NULL,'
        + 'available TEXT NOT NULL,'
        + 'FOREIGN KEY (cid) REFERENCES category (id)'
        + ');';

    let alreadyExistsErrMsg = 'already exists';

    conn.serialize(() => {
        conn.run(categoryTable, (err) => {
            if (err && err.message.indexOf(alreadyExistsErrMsg) > -1) {
                console.log('category table exists');
                return;
            }
            if (err) {
                console.error('create category table err', err.message);
                return;
            }
            console.log('category table created successfully');
            return;
        })
        .run(menuTable, (err) => {
            if (err && err.message.indexOf(alreadyExistsErrMsg) > -1) {
                console.log('menu table exists');
                return;
            }
            if (err) {
                console.log('create menu table err', err.message);
                return;
            }
            console.log('menu table created successfully');
            return;
        });
    });
}