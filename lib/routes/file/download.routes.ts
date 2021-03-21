import { Router } from "express";
import { FileController } from "../../controllers/file.controller"


export const fileDownloadRoutes: Router = Router();

const fileController = new FileController();


fileDownloadRoutes.get('/:id/thumbnail', fileController.download('thumbnail'))
fileDownloadRoutes.get('/:id/supported', fileController.download('supported'))
fileDownloadRoutes.get('/:id/', fileController.download())