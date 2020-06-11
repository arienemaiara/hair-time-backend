import { Request, Response, NextFunction } from 'express';

import { AuthError } from '../../errors/auth';

import User from '../../models/User';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user.provider)
            throw new AuthError('User is not a provider.');

        return next();

    } catch (error) {
        return res.status(401).json(error);
    }
    
}