import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';
import database from '../../database';

import File from './File';

export interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
    password_hash: string;
    provider: boolean;
    created_at?: Date;
    updated_at?: Date;
};

class User extends Model implements UserAttributes {
    public id?: number;
    public name!: string;
    public email!: string;
    public password: string;
    public password_hash: string;
    public provider!: boolean;
    public avatar: object;
    public readonly created_at?: Date;
    public readonly updated_at?: Date;

    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password_hash);
    }
}

User.init({
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.VIRTUAL,
    password_hash: Sequelize.STRING,
    provider: Sequelize.BOOLEAN,
},
{
    sequelize: database.connection
});

User.belongsTo(File, { foreignKey: 'avatar_id', as: 'avatar' });

User.addHook(
    'beforeSave', 
    async (user: User): Promise<void> => {
        if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
        }
    }
);

export default User;