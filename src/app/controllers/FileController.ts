import { Request, Response } from 'express';

import File from '../models/File';

class FileController {
    async create(req: Request, res: Response) {
        try {
            const { originalname: name, filename: path} = req.file;
            const file = await File.create({ name, path });

            return res.json(file);
        } catch (error) {
            return res.status(500).json(error)
        }
        
    }
}

const fileController: FileController = new FileController();

export default fileController;