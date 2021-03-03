const http = require('http');
import * as express from "express"
const app = express();

import * as wol from "wake_on_lan";


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


app.listen(1800, () => {
    console.log('Node server running on port 1800');
});