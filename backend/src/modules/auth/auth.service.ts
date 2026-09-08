import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../users/user.repository';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error';
import { IUser, Role } from '../../models/User';

export class AuthService {
  async register(data: any): Promise<IUser> {
    const { firstName, lastName, email, password } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Make the first user an ADMIN, others TEAM_MEMBER
    const isFirstUser = (await userRepository.findAll()).length === 0;
    const role = isFirstUser ? Role.ADMIN : Role.TEAM_MEMBER;

    const user = await userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;
    return userObj as IUser;
  }

  async login(data: any): Promise<{ user: Partial<IUser>; token: string }> {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 403);
    }

    const userWithPassword = await userRepository.findByIdWithPassword(user._id.toString());
    const isMatch = await bcrypt.compare(password, userWithPassword!.passwordHash);

    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user._id.toString(), user.role);

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return { user: userObj, token };
  }

  generateToken(id: string, role: string): string {
    return jwt.sign({ id, role }, env.JWT_SECRET as jwt.Secret, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }
}

export const authService = new AuthService();
