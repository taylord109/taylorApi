import { NextFunction, Request, Response } from "express";

export class AuthHandler {


    public static isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req["isAuthenticated"] && req["isAuthenticated"]()) {
            return next();
        }
        return res.status(401).end();
    }

}