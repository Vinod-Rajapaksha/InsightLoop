import { Request, Response, NextFunction } from 'express';
import { projectRepository } from './project.repository';
import { successResponse } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/error';

export class ProjectController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectRepository.create({
        ...req.body,
        createdBy: req.user!._id,
      });
      res.status(201).json(successResponse('Project created', { project }));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await projectRepository.findAll();
      res.status(200).json(successResponse('Projects retrieved', { projects }));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectRepository.findById(req.params.id as string);
      if (!project) throw new AppError('Project not found', 404);
      res.status(200).json(successResponse('Project retrieved', { project }));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectRepository.update(req.params.id as string, req.body);
      if (!project) throw new AppError('Project not found', 404);
      res.status(200).json(successResponse('Project updated', { project }));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectRepository.delete(req.params.id as string);
      if (!project) throw new AppError('Project not found', 404);
      res.status(200).json(successResponse('Project deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
