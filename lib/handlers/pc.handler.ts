import { Request, Response } from 'express';
import * as wol from "wake_on_lan";

export class PCHandler {
    public static wakeUpDesktop(req: Request, res: Response) {
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
    }
}