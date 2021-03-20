import * as express from "express"
import { allRoutes } from "./routes";
import * as mongoose from "mongoose";
import { mongoUrl } from "./conf/mongo.conf"
import * as cors from "cors";

const http = require('http');
const app = express();

const corsOptions = {
    origin: ['http://localhost'],
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

mongoose.connect(mongoUrl, { useNewUrlParser: true }, function (err) {
    if (!err) {
        console.log("Successfully connected to Taylor's Server");
    } else {
        console.log("Failed to connect to Taylor's Server");
    }
})

app.use(allRoutes);
app.listen(1800, () => {
    console.log('Node server running on port 1800');
});