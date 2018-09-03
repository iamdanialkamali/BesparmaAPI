import Sequelize from 'sequelize';

const sequelize = new Sequelize('besparma_db', 'besparma', 'besparman', {
    dialect: 'postgres'
});

export default sequelize;