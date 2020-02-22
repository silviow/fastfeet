import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                cep: Sequelize.STRING,
                street: Sequelize.STRING,
                number: Sequelize.STRING,
                address_complement: Sequelize.STRING,
                city: Sequelize.STRING,
                state: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Recipient;
