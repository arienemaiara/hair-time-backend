import { Request, Response, NextFunction } from 'express';
import { isBefore, subHours } from 'date-fns';

import { ValidationError } from '../../errors/validation';

import Appointment from '../../models/Appointment';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (appointment.user_id.toString() !== req.userId.toString()) 
            throw new ValidationError("You don't have permission to cancel this appointment.");

        const dateSub = subHours(appointment.date, 2);

        if (isBefore(dateSub, new Date()))
            throw new ValidationError("You can only cancel appointments 2 hours in advance.");

        next();

    } catch (error) {
        return res.status(401).json(error);
    }
    
}