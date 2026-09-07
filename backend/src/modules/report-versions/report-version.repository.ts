import { ReportVersion, IReportVersion } from '../../models/ReportVersion';

export class ReportVersionRepository {
  async create(data: Partial<IReportVersion>): Promise<IReportVersion> {
    const version = new ReportVersion(data);
    return await version.save();
  }

  async findByReportId(reportId: string): Promise<IReportVersion[]> {
    return await ReportVersion.find({ reportId }).sort({ versionNumber: -1 }).populate('submittedBy', 'firstName lastName');
  }
}

export const reportVersionRepository = new ReportVersionRepository();
