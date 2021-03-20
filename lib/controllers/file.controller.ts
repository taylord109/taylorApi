import * as mongoose from 'mongoose';
import { FileSchema } from '../models/file.models';
import { Request, Response } from 'express';
import * as fs from "fs";

const File = mongoose.model('files', FileSchema, 'files');

export class FileController {


    public addFile(req: Request, res: Response) {
        let newFile = new File(req.body);

        newFile.save((err, contact) => {
            if (err) {
                return res.send(err).end();
            }
            return res.json(contact).end();
        });
    }


    public getFiles(req: Request, res: Response) {
        File.find({}, (err, files) => {
            if (err) return res.send(err);
            return res.json(files);
        });
    }

    //   /lib/controllers/crmController.ts
    public getFileById(req: Request, res: Response) {
        if (!req?.params?.fileId) return res.status(400).send(new Error("'fileId' Required")).end();
        File.findOne({ id: req.params.fileId }, (err, files) => {
            if (err) return res.send(err);
            return res.json(files);
        });
    }

    public getDownloadFile(req: Request, res: Response) {
        if (!req?.params?.fileName) return res.status(400).send(new Error("'fileName' Required")).end();
        File.findOne({ name: "Ashen Inquisitor A - Supported" }, async (err, files) => {
            if (err) return res.send(err).end();
            if (!files || !files["_doc"] || !files["_doc"]["path"]) return res.send(JSON.stringify(new Error("Filed to find a file"))).end();
            let file = files._doc;
            const path: string = "/var/external" + file.path;
            var hasFile = await new Promise<boolean>((resolve, reject) => {
                fs.lstat(path, (err, results) => {
                    if (err) return resolve(false)
                    return resolve(true);
                });
            });
            if (!hasFile) return res.send(JSON.stringify(new Error("Filed to find a file"))).end();

            var stream = fs.createReadStream(path);

            stream.on('error', function (error) {
                res.writeHead(404, 'Not Found');
                res.end();
            });

            return stream.pipe(res);
        });
    }

    //   /lib/controllers/crmController.ts
    public updateFile(req: Request, res: Response) {
        if (!req?.params?.fileId) return res.status(400).send(new Error("'fileId' Required")).end();
        File.findOneAndUpdate({ id: req.params.fileId }, req.body, { new: true }, (err, files) => {
            if (err) return res.send(err)
            return res.json(files);
        });
    }
}