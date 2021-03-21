import { Router } from "express";
import { FileController } from "../../controllers/file.controller"


export const fileDownloadRoutes: Router = Router();

const fileController = new FileController();


fileDownloadRoutes.get('/:id/thumbnail', fileController.download('thumbnail'))
fileDownloadRoutes.get('/:id/supported', fileController.download('supported'))
fileDownloadRoutes.get('/:id', fileController.download())

//Mock files
fileDownloadRoutes.get('/:id/thumbnail/:fileName', fileController.download('thumbnail'))
fileDownloadRoutes.get('/:id/supported/:fileName', fileController.download('supported'))
fileDownloadRoutes.get('/:id/:fileName', fileController.download())