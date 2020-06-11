import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import { ValidationError } from '../../errors/validation';
import { DataAlreadyExistsError } from '../../errors/database';

import { AppointmentValidationSchema } from './ValidationSchema';

import User from '../../models/User';
import Appointment from '../../models/Appointment';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        const schema = Yup.object<AppointmentValidationSchema>().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required()
        });

        const isFormValid = await schema.isValid(req.body, { abortEarly: false });
        if (!isFormValid)
            throw new ValidationError('Error while validating fields.');

        const { provider_id, date } = req.body;

        /** Check if provider_id belongs to a provider */
        const isProvider = await User.findOne({
            where: {
                id: provider_id,
                provider: true
            }
        });

        if (!isProvider)
            throw new ValidationError('Invalid provider.');

        /** Check if users are the same */
        if (provider_id === req.userId) 
            throw new ValidationError('You cannot make an appoitment for yourself.');

        /** Check past dates */
        const hourStart = startOfHour(parseISO(date));
        if (isBefore(hourStart, new Date()))
            throw new ValidationError('The date should not be in the past.');

        /** Check past availability */
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart
            }
        });

        if (checkAvailability)
            throw new DataAlreadyExistsError('Appointment');

        return next();

    } catch (error) {
        return res.status(400).json(error);
    }
}