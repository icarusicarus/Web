const User = require('./users');
const Board = require('./board');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Board = Board;

User.init(sequelize);
Board.init(sequelize);

User.associate(db);
Board.associate(db);

module.exports = db;
