import * as mongoose from 'mongoose';
import { FileSchema } from '../models/file.models';
import { Request, Response } from 'express';

const File = mongoose.model('shared_files ', FileSchema, 'shared_files');

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
        if (req.params.fileId) return res.status(400).send(new Error("'fileId' Required")).end();
        File.findById(req.params.fileId, (err, files) => {
            if (err) return res.send(err);
            return res.json(files);
        });
    }

    //   /lib/controllers/crmController.ts
    public updateFile(req: Request, res: Response) {
        if (req.params.fileId) return res.status(400).send(new Error("'fileId' Required")).end();
        File.findOneAndUpdate({ _id: req.params.fileId }, req.body, { new: true }, (err, files) => {
            if (err) return res.send(err)
            return res.json(files);
        });
    }
}