import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

interface UserAttributes {
  id: number;
  username: string | null;
  full_name: string | null;
  email: string;
  socket_id?: string;
  profile_picture: string | null;
  otp: number | null;
  other_data: Record<string, any> | null;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'username' | 'full_name' | 'profile_picture' | 'otp' | 'other_data'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string | null;
  public full_name!: string | null;
  public profile_picture!: string | null;
  public email!: string;
  public socket_id?: string;
  public otp!: number | null;
  public other_data!: Record<string, any> | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socket_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    other_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
