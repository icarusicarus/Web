//models/board.js
const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false,
            },
            body: {
                type: Sequelize.STRING(2000),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Board',
            tableName: 'board',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Board.belongsTo(db.User, {foreignKey: 'author', targetKey: 'username'});
    }
};
