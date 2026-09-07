import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport, useApproveReport, useRequestChanges } from '@/features/reports/hooks/use-reports';
import { ReportViewer } from '@/components/reports/ReportViewer';
import { ReportStatusBadge } from '@/components/shared/ReportStatusBadge';
import { ReportStatus } from '@/types';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ManagerReportReviewComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: report, isLoading } = useReport(id as string);
  const approveMutation = useApproveReport();
  const requestChangesMutation = useRequestChanges();

  const [comment, setComment] = useState('');
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);

  if (isLoading || !report) {
    return <div className="p-8 text-center">Loading report details...</div>;
  }

  const isReviewable = report.currentStatus === ReportStatus.SUBMITTED;

  const handleApprove = async () => {
    if (confirm('Are you sure you want to approve this report?')) {
      try {
        await approveMutation.mutateAsync(id as string);
        toast.success('Report approved successfully');
        navigate('/manager/reports');
      } catch (error) {
        toast.error('Failed to approve report');
      }
    }
  };

  const handleRequestChanges = async () => {
    if (!comment.trim()) {
      toast.error('Please provide a comment explaining what needs to be changed.');
      return;
    }
    try {
      await requestChangesMutation.mutateAsync({ id: id as string, comments: comment });
      toast.success('Changes requested successfully');
      setIsChangeDialogOpen(false);
      navigate('/manager/reports');
    } catch (error) {
      toast.error('Failed to request changes');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Review Report
              <ReportStatusBadge status={report.currentStatus} />
            </h1>
          </div>
        </div>
        
        {isReviewable && (
          <div className="flex gap-3">
            <Dialog open={isChangeDialogOpen} onOpenChange={setIsChangeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
                  <MessageSquareWarning className="h-4 w-4 mr-2" />
                  Request Changes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Changes</DialogTitle>
                  <DialogDescription>
                    Provide clear feedback on what needs to be corrected. The team member will receive this report back as "Needs Correction".
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea 
                    placeholder="Enter your feedback here..." 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsChangeDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleRequestChanges} disabled={requestChangesMutation.isPending}>
                    {requestChangesMutation.isPending ? 'Sending...' : 'Send Feedback'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white" disabled={approveMutation.isPending}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {approveMutation.isPending ? 'Approving...' : 'Approve Report'}
            </Button>
          </div>
        )}
      </div>

      <ReportViewer report={report} />
    </div>
  );
};
