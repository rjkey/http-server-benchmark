import datetime
from fastapi import FastAPI
import datetime
import json
import sqlite3
import uvicorn

app = FastAPI()

conn = sqlite3.connect('benchmark.db')


@app.get("/benchmark")
async def benchmark():
    now = datetime.datetime.now()

    data = {
        'name': 'John Doe',
        'age': 25,
        'email': 'johndoe@example.com',
        'insertDate': now
    }

    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('''
           CREATE TABLE IF NOT EXISTS benchmark (
               name TEXT,
               age INTEGER,
               email TEXT,
               insertDate DATE
           )
       ''')

    cursor.execute('INSERT INTO benchmark VALUES (?, ?, ?, ?)',
                   (data['name'], data['age'], data['email'], now))
    conn.commit()

    inserted_data = cursor.execute(
        'SELECT * FROM benchmark WHERE insertDate = ?', (now,)).fetchone()

    return inserted_data

    # return json.dumps([dict(ix) for ix in inserted_data])  # CREATE JSON

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
