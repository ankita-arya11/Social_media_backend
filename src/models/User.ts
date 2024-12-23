import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

// Define the interface for the User attributes
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Define the interface for the User creation attributes (optional fields)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  // Optional: Define timestamps if needed
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Optional: Define the table name explicitly
    timestamps: true, // Optional: Add timestamps for createdAt and updatedAt
  }
);

export default User;
