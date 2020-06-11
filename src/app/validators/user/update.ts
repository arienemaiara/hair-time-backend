import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

import { DataAlreadyExistsError, DataNotFoundError } from '../../errors/database';
import { ValidationError } from '../../errors/validation';

import { UserUpdateValidationSchema } from './ValidationSchema';

import User from '../../models/User';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        const schema = Yup.object<UserUpdateValidationSchema>().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword: string, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        const isFormValid = await schema.isValid(req.body, { abortEarly: false });
        if (!isFormValid)
            throw new ValidationError('Error while validating fields.');

        const { email, oldPassword } = req.body;
            
        const user = await User.findByPk(req.userId);

        if (user.email !== email) {
            const userExists = await User.findOne({ where: { email } });

            if (userExists)
                throw new DataAlreadyExistsError('User');
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            throw new ValidationError('Password does not match.');
        }

        next();

    } catch (error) {
        return res.status(400).json(error);
    }
}