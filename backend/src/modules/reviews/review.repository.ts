import { ReviewAction, IReviewAction } from '../../models/ReviewAction';

export class ReviewActionRepository {
  async create(data: Partial<IReviewAction>): Promise<IReviewAction> {
    const action = new ReviewAction(data);
    return await action.save();
  }

  async findByReportId(reportId: string): Promise<IReviewAction[]> {
    return await ReviewAction.find({ reportId })
      .sort({ createdAt: -1 })
      .populate('reviewerId', 'firstName lastName');
  }
}

export const reviewActionRepository = new ReviewActionRepository();
