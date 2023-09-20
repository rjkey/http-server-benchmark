const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const SERVER_PORT = 8000;
const DB_FILE_PATH = 'benchmark.db';
const db = new sqlite3.Database(DB_FILE_PATH);

app.get('/benchmark', (req, res) => {
    const now = new Date().toISOString();
    const data = {
        name: 'John Doe',
        age: 25,
        email: 'johndoe@example.com',
        insertDate: now
    };



    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS benchmark (
              name TEXT,
              age INTEGER,
              email TEXT,
              insertDate DATE
            )
        `);

        db.run(
            'INSERT INTO benchmark VALUES (?, ?, ?, ?)',
            [data.name, data.age, data.email, data.insertDate]
        );

        db.get(
            'SELECT * FROM benchmark WHERE insertDate = ?',
            [data.insertDate],
            (err, row) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end();
                } else {
                    const json_data = JSON.stringify(row);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(json_data);
                }
            }
        );
    });

});

app.use((req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('Not found');
});

const server = app.listen(SERVER_PORT, () => {
    console.log(`Starting server on port ${SERVER_PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Stopping server...');
        db.close();
        process.exit();
    });
});
