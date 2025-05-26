import { DataTypes, Model } from 'sequelize'
import { DB_MAIN } from '../../dbs/index'

class UserInfo extends Model {
}

UserInfo.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      unique: true,
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize: DB_MAIN,
    indexes: [
      { unique: true, fields: ['username'] },
    ],
  },
)

export default UserInfo
