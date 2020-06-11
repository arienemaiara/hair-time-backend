import { Request, Response } from 'express';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
    async index(req: Request, res: Response) {

        try {
            const date = req.query.date as any;
            const parsedDate = parseISO(date);

            const appointments = await Appointment.findAll({
                where: {
                    provider_id: req.userId,
                    canceled_at: null,
                    date: {
                        [Op.between]: [startOfDay(parsedDate).toISOString(), endOfDay(parsedDate).toISOString()]
                    }
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['name']
                    }
                ]
            });

            res.send(appointments);
            
        } catch (error) {
            return res.status(500).json(error);
        }

    }
}

export default new ScheduleController;