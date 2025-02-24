import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

interface UserAttributes {
  id: number;
  username: string | null;
  full_name: string | null;
  email: string;
  socket_id?: string;
  profile_picture: string | null;
  cover_picture?: string | null;
  location?: string | null;
  job_title?: string | null;
  university?: string | null;
  bio?: string | null;
  friends?: number;
  followings?: number;
  posts?: number;
  otp: number | null;
  other_data: Record<string, any> | null;
  role: 'admin' | 'user' | 'manager';
  permissions: {
    can_create_post: boolean;
    can_create_event: boolean;
    [key: string]: any;
  };
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'username'
    | 'full_name'
    | 'profile_picture'
    | 'cover_picture'
    | 'location'
    | 'job_title'
    | 'university'
    | 'bio'
    | 'friends'
    | 'followings'
    | 'posts'
    | 'otp'
    | 'other_data'
    | 'role'
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string | null;
  public full_name!: string | null;
  public profile_picture!: string | null;
  public cover_picture!: string | null;
  public location!: string | null;
  public job_title!: string | null;
  public university!: string | null;
  public bio!: string | null;
  public friends!: number;
  public followings!: number;
  public posts!: number;
  public email!: string;
  public socket_id?: string;
  public otp!: number | null;
  public other_data!: Record<string, any> | null;
  public permissions!: {
    can_create_post: boolean;
    can_create_event: boolean;
    [key: string]: any;
  };
  public role!: 'admin' | 'user' | 'manager';

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
    cover_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    university: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    friends: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    followings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    posts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    socket_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'manager'),
      allowNull: false,
      defaultValue: 'user',
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        can_create_post: true,
        can_create_event: false,
      },
    },
    other_data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
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
