import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ReportStatus } from '@/types';
import { cn } from '@/utils';

interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status, className }) => {
  const config = {
    [ReportStatus.DRAFT]: {
      label: 'Draft',
      variant: 'secondary' as const,
      colorClass: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
    },
    [ReportStatus.SUBMITTED]: {
      label: 'Submitted',
      variant: 'default' as const,
      colorClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
    },
    [ReportStatus.NEEDS_CORRECTION]: {
      label: 'Needs Correction',
      variant: 'destructive' as const,
      colorClass: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200'
    },
    [ReportStatus.APPROVED]: {
      label: 'Approved',
      variant: 'default' as const,
      colorClass: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
    }
  };

  const { label, colorClass } = config[status] || { label: status, colorClass: '' };

  return (
    <Badge variant="outline" className={cn("font-medium", colorClass, className)}>
      {label}
    </Badge>
  );
};
