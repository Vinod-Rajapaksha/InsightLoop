import { Report, IReport } from '../../models/Report';

export class ReportRepository {
  async create(data: Partial<IReport>): Promise<IReport> {
    const report = new Report(data);
    return await report.save();
  }

  async findById(id: string): Promise<IReport | null> {
    return await Report.findById(id).populate('project', 'name').populate('owner', 'firstName lastName');
  }

  async update(id: string, data: Partial<IReport>): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(id, data, { new: true });
  }

  async findMany(
    filter: any,
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 1 | -1 = -1
  ): Promise<{ data: IReport[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Report.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('project', 'name')
        .populate('owner', 'firstName lastName'),
      Report.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const reportRepository = new ReportRepository();
