import { Project, IProject } from '../../models/Project';

export class ProjectRepository {
  async create(data: Partial<IProject>): Promise<IProject> {
    const project = new Project(data);
    return await project.save();
  }

  async findById(id: string): Promise<IProject | null> {
    return await Project.findById(id).populate('assignedMembers', 'firstName lastName email').populate('createdBy', 'firstName lastName');
  }

  async findAll(): Promise<IProject[]> {
    return await Project.find().populate('assignedMembers', 'firstName lastName email').populate('createdBy', 'firstName lastName');
  }

  async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(id, data, { new: true })
      .populate('assignedMembers', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName');
  }

  async delete(id: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(id);
  }
}

export const projectRepository = new ProjectRepository();
