import * as mongoose from 'mongoose';
import { UserSchema } from '../models/user.models';
import { Request, Response } from 'express';
import * as fs from "fs";

export const User = mongoose.model('users', UserSchema, 'users');

export class UserController {


    public addUser(req: Request, res: Response) {
        let newUser = new User(req.body);

        newUser.save((err, contact) => {
            if (err) {
                return res.send(err).end();
            }
            return res.json(contact).end();
        });
    }


    public getUser(req: Request, res: Response) {
        User.find({}, '-path -accessable', undefined, (err, users: Array<mongoose.Document<{ thumbnail?: string }>>) => {
            if (err) return res.send(err);
            let usersJson = users.map((user) => {
                const newUser = user.toJSON();
                return { ...newUser, "thumbnail": !!newUser["thumbnail"], "supported": !!newUser["supported"] };
            })
            return res.json(usersJson);
        });
    }

    //   /lib/controllers/crmController.ts
    public getUserById(req: Request, res: Response) {
        if (!req?.params?.id) return res.status(400).send(new Error("'id' Required")).end();
        User.findOne({ _id: req.params.id }, "-path -accessable", undefined, (err, users: mongoose.Document<any>) => {
            if (err) return res.send(err);
            let userJson = users.toJSON();
            return res.json({ ...userJson, "thumbnail": !!userJson["thumbnail"], "supported": !!userJson["supported"] });
        });
    }

    //   /lib/controllers/crmController.ts
    public updateUser(req: Request, res: Response) {
        if (!req?.params?.userId) return res.status(400).send(new Error("'userId' Required")).end();
        User.findOneAndUpdate({ id: req.params.userId }, req.body, { new: true }, (err, users) => {
            if (err) return res.send(err)
            return res.json(users);
        });
    }
}