import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

import { DataAlreadyExistsError } from '../../errors/database';
import { ValidationError } from '../../errors/validation';

import { UserValidationSchema } from './ValidationSchema';

import User from '../../models/User';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        const schema = Yup.object<UserValidationSchema>().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        const isFormValid = await schema.isValid(req.body, { abortEarly: false });
        if (!isFormValid)
            throw new ValidationError('Error while validating fields.');
            
        const userAlredyExists = await User.findOne({
            where: { email: req.body.email }
        });

        if (userAlredyExists)
            throw new DataAlreadyExistsError('User');

        next();

    } catch (error) {
        return res.status(400).json(error);
    }
}