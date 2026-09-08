import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  type: string;
  status: string;
  isActive: boolean;
  assignedMembers: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: 'General' },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'ARCHIVED'], default: 'ACTIVE' },
    isActive: { type: Boolean, default: true },
    assignedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
