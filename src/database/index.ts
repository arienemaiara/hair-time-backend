import * as Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

class Database {
    public connection: Sequelize.Sequelize;
    public mongoConnection: Promise<typeof mongoose>;

    constructor() {
        this.init();
        this.mongo();
    }

    init(): void { 
        this.connection = new Sequelize.Sequelize(databaseConfig);
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true
            }
        );
    }
}

const database: Database = new Database();

export default database;