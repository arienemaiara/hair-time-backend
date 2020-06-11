import Sequelize, { Model } from 'sequelize';
import database from '../../database';

import User from './User';

export interface FileAttributes {
    id?: number;
    date: Date;
    user_id: number;
    canceled_at: Date;
    created_at?: Date;
    updated_at?: Date;
};

class Appointment extends Model implements FileAttributes {
    public id?: number;
    public user_id!: number;
    public date!: Date;
    public canceled_at!: Date;
    public readonly created_at?: Date;
    public readonly updated_at?: Date;
}

Appointment.init({
    date: Sequelize.DATE,
    canceled_at: Sequelize.DATE,
},
{
    sequelize: database.connection
});

Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Appointment.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

export default Appointment;