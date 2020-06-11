import Sequelize, { Model } from 'sequelize';
import database from '../../database';


export interface FileAttributes {
    id?: number;
    name: string;
    path: string;
    url: string;
    created_at?: Date;
    updated_at?: Date;
};

class File extends Model implements FileAttributes {
    public id?: number;
    public name!: string;
    public path!: string;
    public url: string;
    public readonly created_at?: Date;
    public readonly updated_at?: Date;
}

File.init({
    name: Sequelize.STRING,
    path: Sequelize.STRING,
    url: {
        type: Sequelize.VIRTUAL,
        get() {
            return `${process.env.API_URL}/files/${this.path}`;
        }
    }
},
{
    sequelize: database.connection
});

export default File;