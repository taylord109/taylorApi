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
        File.find({}, '-path -accessable', undefined, (err, files: Array<mongoose.Document<{ thumbnail?: string }>>) => {
            if (err) return res.send(err);
            let filesJson = files.map((file) => {
                const newFile = file.toJSON();
                return { ...newFile, "thumbnail": !!newFile["thumbnail"], "supported": !!newFile["supported"] };
            })
            return res.json(filesJson);
        });
    }

    //   /lib/controllers/crmController.ts
    public getFileById(req: Request, res: Response) {
        if (!req?.params?.id) return res.status(400).send(new Error("'id' Required")).end();
        File.findOne({ _id: req.params.id }, "-path -accessable", undefined, (err, files: mongoose.Document<any>) => {
            if (err) return res.send(err);
            let fileJson = files.toJSON();
            return res.json({ ...fileJson, "thumbnail": !!fileJson["thumbnail"], "supported": !!fileJson["supported"] });
        });
    }

    public download(fileType: 'path' | 'thumbnail' | 'supported' = 'path') {
        return (req: Request, res: Response) => {
            if (!req?.params?.id) return res.status(400).send("No Id provided").end();
            File.findOne({ _id: req?.params?.id }, async (err: mongoose.CallbackError, files) => {
                if (err) return res.status(400).send("Db find error: " + err.message).end();

                if (!files || !files["_doc"] || !files["_doc"][fileType]) return res.status(400).send(`No ${fileType} found in db`).end();
                const path: string = "/var/external" + files?._doc[fileType];
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