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
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isEditing ? 'Edit Weekly Report' : 'New Weekly Report'}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          {isEditing 
            ? 'Update your weekly progress, accomplishments, and upcoming goals.' 
            : 'Fill out your weekly progress, key accomplishments, and planned tasks for team review.'}
        </p>
        {report?.currentStatus === ReportStatus.NEEDS_CORRECTION && (
          <p className="text-rose-700 bg-rose-50 border border-rose-200/80 p-3.5 rounded-xl font-medium text-sm mt-3 flex items-center gap-2">
            <span>⚠️</span> This report was returned for correction. Please address the feedback and resubmit.
          </p>
        )}
      </div>
      <ReportForm />
    </div>
  );
};
