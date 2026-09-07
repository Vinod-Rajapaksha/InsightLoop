import { reportWorkflowService } from '../../../src/modules/reports/report-workflow.service';
import { ReportStatus } from '../../../src/models/Report';

describe('Report Service - Unit Tests', () => {
  it('should be defined with required state transitions', () => {
    expect(reportWorkflowService).toBeDefined();
    expect(typeof reportWorkflowService.createDraft).toBe('function');
    expect(typeof reportWorkflowService.submitReport).toBe('function');
    expect(typeof reportWorkflowService.approveReport).toBe('function');
    expect(typeof reportWorkflowService.requestCorrection).toBe('function');
  });

  it('should contain valid report statuses', () => {
    expect(ReportStatus.DRAFT).toBe('DRAFT');
    expect(ReportStatus.SUBMITTED).toBe('SUBMITTED');
    expect(ReportStatus.APPROVED).toBe('APPROVED');
    expect(ReportStatus.NEEDS_CORRECTION).toBe('NEEDS_CORRECTION');
  });
});
