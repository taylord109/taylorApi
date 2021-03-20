import { Router } from "express";
import { FileController } from "../controllers/file.controller"


export const fileRoutes: Router = Router();

const fileController = new FileController();

fileRoutes.route('/')
    .get(fileController.getFiles)
//.post(fileController.addFile);

fileRoutes.route('/:id')
    .get(fileController.getFileById)
//.put(fileController.updateFile);

fileRoutes.get('/download/:fileName', fileController.getDownloadFile)
fileRoutes.get('/thumbnail/:name', fileController.getThumbnailFile)