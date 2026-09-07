import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  TEAM_MEMBER = 'TEAM_MEMBER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.TEAM_MEMBER,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
