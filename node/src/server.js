const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const SERVER_PORT = 8000;
const DB_FILE_PATH = 'benchmark.db';

const server = http.createServer((req, res) => {
    if (req.url === '/benchmark') {
        const now = new Date().toISOString();
        const data = {
            name: 'John Doe',
            age: 25,
            email: 'johndoe@example.com',
            insertDate: now
        };

        const db = new sqlite3.Database(DB_FILE_PATH);

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

        db.close();
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('Not found');
    }
});

server.listen(SERVER_PORT, () => {
    console.log(`Starting server on port ${SERVER_PORT}`);
});

process.on('SIGINT', () => {
    db.close();
    console.log('Stopping server...');
    process.exit();
});
