import { Request, Response } from 'express';
import { startOfHour, parseISO, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notification from '../schemas/Notification';

class AppointmentController {

    async index(req: Request, res: Response) {
        try {

            const page = parseInt(req.query.page?.toString()) || 1;
           
            const appointments = await Appointment.findAll({
                where: {
                    user_id: req.userId,
                    canceled_at: null
                },
                order: ['date'],
                limit: 20,
                offset: (page - 1) * 20,
                include: [
                    {
                        model: User,
                        as: 'provider',
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: File,
                                as: 'avatar',
                                attributes: ['id', 'path', 'url']
                            }
                        ]
                    }
                ]
            });

            return res.json(appointments);

        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {

            const { provider_id, date } = req.body;
            const hourStart = startOfHour(parseISO(date));
            
            const appointment = await Appointment.create({
                user_id: req.userId,
                provider_id,
                date: hourStart
            });

            /**Notify appointment provider */
            const user = await User.findByPk(req.userId);
            
            const formatedDate = format(
                hourStart,
                "'dia' dd 'de' MMMM, 'às' H:mm'h'",
                { locale: ptBR }
            );

            await Notification.create({
                content: `Novo agendamento de ${user.name} para ${formatedDate}`,
                user: provider_id
            });

            return res.json(appointment);

        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);

            appointment.canceled_at = new Date();

            await appointment.save();

            return res.json(appointment);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

const appointmentController: AppointmentController = new AppointmentController();
export default appointmentController;