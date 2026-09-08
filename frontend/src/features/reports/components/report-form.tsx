import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, startOfWeek, endOfWeek, subDays, addDays } from 'date-fns';
import { toast } from 'sonner';

import { ReportFormValues, reportFormSchema } from '@/features/reports/schemas/report-form.schema';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useReport, useCreateReport, useUpdateReport, useSubmitReport } from '@/features/reports/hooks/use-reports';
import { ReportStatus, TaskPriority, TaskStatus } from '@/types';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConfirmAlert } from '@/components/ui/confirm-alert';
import { Plus, Trash2, ArrowLeft, Save, Send, Calendar } from 'lucide-react';

export const ReportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: report, isLoading: reportLoading } = useReport(id as string);
  
  const createMutation = useCreateReport();
  const updateMutation = useUpdateReport();
  const submitMutation = useSubmitReport();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  // Initialize form
  const form = useForm<any>({
    resolver: zodResolver(reportFormSchema),
    mode: 'onChange',
    defaultValues: {
      weekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      weekEnd: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      project: '',
      tasksCompleted: [],
      nextWeekTasks: [],
      blockers: [],
      achievements: [],
      hoursByTaskType: {
        Development: 0,
        Testing: 0,
        Meetings: 0,
        Documentation: 0,
        Other: 0,
      },
      notes: '',
    },
  });

  const watchedWeekStart = form.watch('weekStart');
  const watchedWeekEnd = form.watch('weekEnd');

  const [isInitialized, setIsInitialized] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (isEditing && report && !projectsLoading && projects && !isInitialized) {
      form.reset({
        weekStart: report.weekStart.split('T')[0],
        weekEnd: report.weekEnd.split('T')[0],
        project: typeof report.project === 'string' 
          ? report.project 
          : ((report.project as any)?._id || (report.project as any)?.id || ''),
        tasksCompleted: report.tasksCompleted as any,
        nextWeekTasks: report.nextWeekTasks as any,
        blockers: report.blockers as any,
        achievements: report.achievements as any,
        hoursByTaskType: report.hoursByTaskType || {
          Development: 0, Testing: 0, Meetings: 0, Documentation: 0, Other: 0
        },
        notes: report.notes || '',
      });
      // Small timeout to let form state settle before rendering UI
      setTimeout(() => setIsInitialized(true), 10);
    }
  }, [report, isEditing, form, projectsLoading, projects, isInitialized]);

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({ control: form.control, name: 'tasksCompleted' });
  const { fields: nextTaskFields, append: appendNextTask, remove: removeNextTask } = useFieldArray({ control: form.control, name: 'nextWeekTasks' });
  const { fields: blockerFields, append: appendBlocker, remove: removeBlocker } = useFieldArray({ control: form.control, name: 'blockers' });
  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({ control: form.control, name: 'achievements' });

  // Handle unique key issue/achievement
  const handleKeyToggle = (index: number, fieldName: 'blockers' | 'achievements', keyProp: 'isKeyIssue' | 'isKeyAchievement') => {
    const items = form.getValues(fieldName);
    items.forEach((item: any, i: number) => {
      // @ts-ignore
      form.setValue(`${fieldName}.${i}.${keyProp}`, i === index);
    });
  };

  const handleSaveDraft = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id, data });
        toast.success('Draft saved successfully');
      } else {
        const res = await createMutation.mutateAsync(data);
        toast.success('Draft created successfully');
        navigate(`/member/reports/${res._id}/edit`, { replace: true });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = async () => {
    // We need to save first, then submit
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }
    
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      let currentId = id;
      // 1. Save data
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data: form.getValues() });
      } else {
        const res = await createMutation.mutateAsync(form.getValues());
        currentId = res._id;
      }
      
      // 2. Submit
      if (currentId) {
        await submitMutation.mutateAsync(currentId);
        toast.success('Report submitted successfully');
        setConfirmOpen(false);
        navigate('/member/reports');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  if (isEditing && (!isInitialized || reportLoading || projectsLoading)) {
    return <div className="p-8 text-center">Loading report data...</div>;
  }

  const isReadOnly = report && (report.currentStatus === ReportStatus.SUBMITTED || report.currentStatus === ReportStatus.APPROVED);

  return (
    <div className="space-y-6 pb-20">
      {/* Correction Notice & Manager Feedback */}
      {report?.currentStatus === ReportStatus.NEEDS_CORRECTION && (
        <Card className="border-amber-200 bg-amber-50/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-900 flex items-center gap-2 text-base font-semibold">
              <span className="text-lg">⚠️</span> Manager Review Feedback
            </CardTitle>
            <CardDescription className="text-amber-800 text-xs">
              This report was returned for correction. Please address the feedback below before resubmitting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-white/80 border border-amber-200/60 rounded-md text-amber-950 text-sm whitespace-pre-wrap font-medium">
              {report.latestReviewComment || 'No specific comment provided by manager.'}
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Section 1: Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField control={form.control} name="weekStart" render={({ field }) => (
                <FormItem>
                  <FormLabel>Week Start Date</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3.5 h-4 w-4 text-indigo-600 pointer-events-none z-10" />
                      <Input 
                        type="date" 
                        max={watchedWeekEnd || undefined}
                        disabled={isReadOnly} 
                        className="pl-10 cursor-pointer font-medium border-slate-200/90 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500/20 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="weekEnd" render={({ field }) => (
                <FormItem>
                  <FormLabel>Week End Date</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3.5 h-4 w-4 text-indigo-600 pointer-events-none z-10" />
                      <Input 
                        type="date" 
                        min={watchedWeekStart || undefined}
                        disabled={isReadOnly} 
                        className="pl-10 cursor-pointer font-medium border-slate-200/90 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500/20 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="project" render={({ field }) => {
                const hasProjects = Array.isArray(projects) && projects.length > 0;
                const [projectSearch, setProjectSearch] = useState('');
                const filteredProjects = hasProjects 
                  ? projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()))
                  : [];
                
                return (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select 
                      disabled={isReadOnly || projectsLoading || !hasProjects} 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-200/90 focus:border-indigo-500 focus:ring-indigo-500/20 font-medium">
                          <SelectValue placeholder={
                            projectsLoading 
                              ? "Loading projects..." 
                              : hasProjects 
                                ? "Select a project" 
                                : "No active projects available"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-64">
                        {hasProjects && projects.length > 5 && (
                          <div className="p-2 sticky top-0 bg-popover z-10 border-b">
                            <Input
                              placeholder="Search project..."
                              value={projectSearch}
                              onChange={(e) => setProjectSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                              className="h-8 text-xs"
                            />
                          </div>
                        )}
                        {projectsLoading ? (
                          <SelectItem value="_loading" disabled>Loading projects...</SelectItem>
                        ) : hasProjects ? (
                          filteredProjects.length > 0 ? (
                            filteredProjects.map(p => (
                              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                            ))
                          ) : (
                            <div className="py-2 px-3 text-xs text-muted-foreground text-center">No projects match search</div>
                          )
                        ) : (
                          <SelectItem value="_empty" disabled>No active projects found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {!projectsLoading && !hasProjects && (
                      <p className="text-[12px] text-amber-600 font-medium mt-1">
                        ⚠️ Contact your manager or admin to assign you to a project.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }} />
            </CardContent>
          </Card>

          <Accordion type="multiple" defaultValue={['tasks', 'next-tasks', 'blockers', 'achievements', 'hours']} className="w-full space-y-4">
            
            {/* Tasks Completed */}
            <AccordionItem value="tasks" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Tasks Completed This Week</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {taskFields.map((field, index) => (
                  <Card key={field.id} className="relative">
                    {!isReadOnly && (
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeTask(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <CardContent className="pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <FormField control={form.control} name={`tasksCompleted.${index}.taskName`} render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Task Name</FormLabel>
                          <FormControl><Input disabled={isReadOnly} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`tasksCompleted.${index}.status`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select disabled={isReadOnly} onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              {Object.values(TaskStatus).map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`tasksCompleted.${index}.priority`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select disabled={isReadOnly} onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              {Object.values(TaskPriority).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`tasksCompleted.${index}.plannedHours`} render={({ field }) => (
                        <FormItem><FormLabel>Planned Hrs</FormLabel><FormControl><Input type="number" disabled={isReadOnly} {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`tasksCompleted.${index}.spentHours`} render={({ field }) => (
                        <FormItem><FormLabel>Spent Hrs</FormLabel><FormControl><Input type="number" disabled={isReadOnly} {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`tasksCompleted.${index}.plannedPercentage`} render={({ field }) => (
                        <FormItem><FormLabel>Planned %</FormLabel><FormControl><Input type="number" disabled={isReadOnly} {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`tasksCompleted.${index}.actualPercentage`} render={({ field }) => (
                        <FormItem><FormLabel>Actual %</FormLabel><FormControl><Input type="number" disabled={isReadOnly} {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </CardContent>
                  </Card>
                ))}
                {!isReadOnly && (
                  <Button type="button" variant="outline" onClick={() => appendTask({ taskName: '', priority: TaskPriority.MEDIUM, plannedPercentage: 100, actualPercentage: 100, status: TaskStatus.COMPLETED, plannedHours: 0, spentHours: 0, deliverable: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Blockers */}
            <AccordionItem value="blockers" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Blockers & Challenges</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {blockerFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <FormField control={form.control} name={`blockers.${index}.description`} render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl><Input placeholder="Describe blocker..." disabled={isReadOnly} {...inputField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`blockers.${index}.isKeyIssue`} render={({ field: checkField }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                        <FormControl>
                          <input type="radio" className="h-4 w-4" disabled={isReadOnly} checked={checkField.value} onChange={() => handleKeyToggle(index, 'blockers', 'isKeyIssue')} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Key Issue</FormLabel>
                      </FormItem>
                    )} />
                    {!isReadOnly && (
                      <Button variant="ghost" size="icon" className="text-destructive mt-0" onClick={() => removeBlocker(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <Button type="button" variant="outline" onClick={() => appendBlocker({ description: '', isKeyIssue: blockerFields.length === 0 })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Blocker
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Achievements */}
            <AccordionItem value="achievements" className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Achievements & Highlights</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {achievementFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <FormField control={form.control} name={`achievements.${index}.description`} render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormControl><Input placeholder="Describe achievement..." disabled={isReadOnly} {...inputField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`achievements.${index}.isKeyAchievement`} render={({ field: checkField }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                        <FormControl>
                          <input type="radio" className="h-4 w-4" disabled={isReadOnly} checked={checkField.value} onChange={() => handleKeyToggle(index, 'achievements', 'isKeyAchievement')} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Key Highlight</FormLabel>
                      </FormItem>
                    )} />
                    {!isReadOnly && (
                      <Button variant="ghost" size="icon" className="text-destructive mt-0" onClick={() => removeAchievement(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <Button type="button" variant="outline" onClick={() => appendAchievement({ description: '', isKeyAchievement: achievementFields.length === 0 })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Achievement
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>

          {/* Sticky Actions Footer */}
          {!isReadOnly && (
            <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-background border-t shadow-lg flex justify-end gap-4 z-10">
              <Button type="button" variant="outline" onClick={form.handleSubmit(handleSaveDraft)} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {report?.currentStatus === ReportStatus.NEEDS_CORRECTION ? 'Save Changes' : 'Save Draft'}
              </Button>
              <Button type="button" onClick={handleSubmitClick} disabled={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                {report?.currentStatus === ReportStatus.NEEDS_CORRECTION ? 'Resubmit' : 'Submit for Review'}
              </Button>
            </div>
          )}
        </form>
      </Form>
      
      <ConfirmAlert
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit Report"
        description="Submit this weekly report for manager review? Submitted reports cannot be edited unless requested."
        confirmText="Submit"
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};
