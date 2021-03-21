import { Router } from "express";
import { FileController } from "../../controllers/file.controller"
import { fileDownloadRoutes } from "./download.routes";


export const fileRoutes: Router = Router();

const fileController = new FileController();


fileRoutes.use('/download/', fileDownloadRoutes)

fileRoutes.route('/')
    .get(fileController.getFiles)
//.post(fileController.addFile);

fileRoutes.route('/:id')
    .get(fileController.getFileById)
//.put(fileController.updateFile);
