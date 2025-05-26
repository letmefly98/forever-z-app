import { Sequelize } from 'sequelize'

const DB_MAIN = new Sequelize({
  dialect: 'sqlite',
  storage: 'test.db',
  define: {
    freezeTableName: true,
  },
})
export default DB_MAIN
