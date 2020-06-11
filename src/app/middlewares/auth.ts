import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { AuthError } from '../errors/auth';
import tokenConfig from '../../config/auth';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            throw new AuthError('Token not provided.');

        const [, token] = authHeader.split(' ');

        const decodedToken: any = jwt.verify(token, tokenConfig.app_secret);

        req.userId = decodedToken.id;

        return next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') 
            error.description = 'Invalid token.'

        return res.status(401).json(error);
    }
    
}