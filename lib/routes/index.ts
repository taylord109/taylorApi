import * as express from 'express'
import { Router, Request, Response } from "express"
import { fileRoutes } from "./file.routes"
import * as wol from "wake_on_lan";
import { PCHandler } from '../handlers/pc.handler';

export const allRoutes: Router = express.Router();

allRoutes.use('/files', fileRoutes);


allRoutes.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Get Successful !!!' });
});
allRoutes.get('/', (req, res) => {
    res.send("Hello World");
});
allRoutes.get('/new', (req, res) => {
    res.send("Wow");
});
allRoutes.post('/wake', PCHandler.wakeUpDesktop);
// allRoutes.get("/files", (req, res) => {
//     try {
//         const mongoUrl = 'mongodb://localhost:27017'; // 'mongodb://taylord109.com:27017'
//         const dbName = 'taylors_server';

//         MongoClient.connect(mongoUrl, { auth: { user: "taylor", password: "" } }, async (err, client) => {
//             strictEqual(null, err);
//             console.log("Connected successfully to server");

//             const db = client.db(dbName);

//             const files = await db.collection("shared_files").find({}).toArray();

//             client.close();
//             try {
//                 return res.status(200).send(JSON.stringify(files));
//             } catch (err) {
//                 res.status(500);
//             }
//         });
//     }
//     catch (err) {
//         return res.status(500).end();
//     }
// });