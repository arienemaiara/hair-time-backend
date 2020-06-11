import { Request, Response } from 'express';

import User from '../models/User';
import File from '../models/File';

class ProviderController {
    async index(req: Request, res: Response) {
        try {
            
            const providers = await User.findAll({
                where: { provider: true },
                attributes: ['id', 'name', 'email'],
                include: [{
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url']
                }]
            });

            return res.json(providers);

        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

const providerController: ProviderController = new ProviderController();
export default providerController;