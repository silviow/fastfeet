module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('deliveries', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            product: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            recipient_id: {
                type: Sequelize.INTEGER,
                references: { model: 'recipients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            deliveryman_id: {
                type: Sequelize.INTEGER,
                references: { model: 'deliverymen', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            signature_id: {
                type: Sequelize.INTEGER,
                references: { model: 'files', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            canceled_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('deliveries');
    },
};
