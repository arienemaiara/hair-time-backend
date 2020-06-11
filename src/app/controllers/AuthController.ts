import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DataNotFoundError } from '../errors/database';
import { AuthError } from '../errors/auth';
import tokenConfig from '../../config/auth';

import User from '../models/User';
import File from '../models/File';

class AuthController {
    async create(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ 
                where: { email },
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributtes: ['id', 'path', 'url'],
                    }
                ]
            });
            if (!user)
                throw new DataNotFoundError('User');

            if (!(await user.checkPassword(password)))
                throw new AuthError('Invalid password.');

            const { id, name, provider, avatar } = user;
            const token = jwt.sign({ id }, tokenConfig.app_secret, {
                expiresIn: tokenConfig.expires_in
            });

            return res.json({ 
                user: { id, name, avatar, provider },
                token
            });
                

        } catch (error) {
            return res.status(401).json(error);
        }
        

    }
}

const authController: AuthController = new AuthController();
export default authController;