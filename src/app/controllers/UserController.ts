import { Request, Response } from 'express';

import User, { UserAttributes } from '../models/User';
import File from '../models/File';

class UserController {
    async index(req: Request, res: Response) {
        try {

            const users = await User.findAll();
            return res.json({ users: users });

        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const user: UserAttributes = await User.create(req.body);
            return res.json({ id: user.id, name: user.name }); 

        } catch (error) {
            return res.status(400).json(error);
        }
             
    }

    async update(req: Request, res: Response) {
        try {
            const user = await User.findByPk(req.userId);
            await user.update(req.body);
            const { id, name, avatar } = await User.findByPk(req.userId, {
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['id', 'path', 'url']
                    }
                ]
            });
            return res.json({ id, name, avatar }); 
        } catch (error) {
            return res.status(400).json(error);
        }
             
    }
}

const userController: UserController = new UserController();

export default userController;