import { User, IUser } from '../../models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export class UserService {
  async updateProfile(userId: string | mongoose.Types.ObjectId, data: UpdateProfileDto): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(data.password, salt);
    }

    await user.save();
    
    // Return user without password hash
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj as IUser;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find().select('-passwordHash');
    return users as IUser[];
  }

  async updateRole(userId: string, role: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    (user as any).role = role;
    await user.save();
    
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj as IUser;
  }

  async updateStatus(userId: string, isActive: boolean): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    (user as any).isActive = isActive;
    await user.save();
    
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return userObj as IUser;
  }
}

export const userService = new UserService();
