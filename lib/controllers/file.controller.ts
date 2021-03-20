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
        if (!req?.params?.fileName) return res.status(400).send("No file found in db").end();
        File.findOne({ filename: req.params.fileName }, async (err: mongoose.CallbackError, files) => {
            if (err) return res.status(400).send("Db find error: " + err.message).end();
            if (!files || !files["_doc"] || !files["_doc"]["path"]) return res.status(400).send("No file found in db").end();
            let file = files._doc;
            const path: string = "/var/external" + file.path;
            var hasFile = await new Promise<boolean>((resolve, reject) => {
                fs.lstat(path, (err, results) => {
                    if (err) return resolve(false)
                    return resolve(true);
                });
            });
            if (!hasFile) return res.status(400).send("No file found in file system").end();

            var stream = fs.createReadStream(path);

            stream.on('error', function (error) {
                return res.status(400).send("Error in streaming: " + error.message).end();
            });

            return stream.pipe(res);
        });
    }

    public getThumbnailFile(req: Request, res: Response) {
        if (!req?.params?.name) return res.status(400).send("No file found in db").end();
        File.findOne({ name: req.params.name }, async (err: mongoose.CallbackError, files) => {
            if (err) return res.status(400).send("Db find error: " + err.message).end();
            if (!files || !files["_doc"] || !files["_doc"]["thumbnail"]) return res.status(400).send("No thumbnail found in db").end();
            let file = files._doc;
            const path: string = "/var/external" + file.thumbnail;
            var hasFile = await new Promise<boolean>((resolve, reject) => {
                fs.lstat(path, (err, results) => {
                    if (err) return resolve(false)
                    return resolve(true);
                });
            });
            if (!hasFile) return res.status(400).send("No file found in file system").end();

            var stream = fs.createReadStream(path);

            stream.on('error', function (error) {
                return res.status(400).send("Error in streaming: " + error.message).end();
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