const http = require('http');
import * as express from "express"
const app = express();

import * as wol from "wake_on_lan";
import { MongoClient } from "mongodb";
import { strictEqual } from "assert";


// let app = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World!\n');
// });


app.get('/', (req, res) => {
    res.send("Hello World");
});
app.get('/new', (req, res) => {
    res.send("Wow");
});
app.post('/wake', (req, res) => {
    try {
        wol.wake("00-24-8C-5A-70-74", { address: "192.168.1.6", port: 7 }, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            } else {
                console.log("Success");
                return res.status(200).end();
            }

        })
    } catch (err) {
        return res.status(500).end();
    }
});
app.get("/files", (req, res) => {
    try {
        const mongoUrl = 'mongodb://localhost:27017'; // 'mongodb://taylord109.com:27017'
        const dbName = 'taylors_server';

        MongoClient.connect(mongoUrl, { auth: { user: "taylor", password: "Lovethyneighbor@4481" } }, async (err, client) => {
            strictEqual(null, err);
            console.log("Connected successfully to server");

            const db = client.db(dbName);

            const files = await db.collection("shared_files").find({}).toArray();

            client.close();
            try {
                return res.status(200).send(JSON.stringify(files));
            } catch (err) {
                res.status(500);
            }
        });
    }
    catch (err) {
        return res.status(500).end();
    }
})


app.listen(1800, () => {
    console.log('Node server running on port 1800');
});