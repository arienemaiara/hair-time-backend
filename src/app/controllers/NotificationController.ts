import { Request, Response } from 'express';
import Notification from '../schemas/Notification';

class NotificationController { 
    async index(req: Request, res: Response) {
        try {

            const notifications = await Notification.find({
                user: req.userId,
            })
            .sort({ createdAt: 'desc' })
            .limit(20);

            return res.json(notifications);
            
        } catch (error) {
            return res.status(500).json(error);
        }

    }

    async update(req: Request, res: Response) {
        try {

            const notification = await Notification.findByIdAndUpdate(
                req.params.id,
                { read: true },
                { new: true }
            );

            return res.json(notification)

        } catch (error) {
            return res.status(500).json(error);
        }

    }
}

export default new NotificationController();