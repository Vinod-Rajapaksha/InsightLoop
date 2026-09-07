import React from 'react';
import { useParams } from 'react-router-dom';
import { ReportForm } from '@/features/reports/components/report-form';
import { useReport } from '@/features/reports/hooks/use-reports';
import { ReportStatus } from '@/enums';

export const MemberReportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { data: report } = useReport(id as string);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Edit Weekly Report' : 'New Weekly Report'}
        </h1>
        {report?.currentStatus === ReportStatus.NEEDS_CORRECTION && (
          <p className="text-destructive mt-1 font-medium">
            This report was returned for correction. Please address the feedback and resubmit.
          </p>
        )}
      </div>
      <ReportForm />
    </div>
  );
};
