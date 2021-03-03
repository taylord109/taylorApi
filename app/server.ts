const http = require('http');

let app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\n');
});
app.listen(1800);
console.log('Node server running on port 1800');