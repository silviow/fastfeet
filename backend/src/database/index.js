import Sequelize from 'sequelize';
import AdminUser from '../app/models/AdminUser';
import Recipient from '../app/models/Recipient';
import databaseConfig from '../config/database';

const models = [AdminUser, Recipient];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection));
    }
}

export default new Database();
