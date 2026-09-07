import { User, IUser, Role } from '../../models/User';

export class UserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-passwordHash');
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findAll(): Promise<IUser[]> {
    return await User.find().select('-passwordHash');
  }

  async updateRole(id: string, role: Role): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
  }
  
  async updateStatus(id: string, isActive: boolean): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-passwordHash');
  }
}

export const userRepository = new UserRepository();
