import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { User, Role } from '../models/User';
import { Project } from '../models/Project';
import { Report, ReportStatus, TaskStatus, TaskPriority } from '../models/Report';
import { ReportVersion } from '../models/ReportVersion';
import { ReviewAction, ReviewActionType } from '../models/ReviewAction';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Wipe existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Report.deleteMany({});
    await ReportVersion.deleteMany({});
    await ReviewAction.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Users
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@insightloop.com',
      passwordHash,
      role: Role.ADMIN,
    });

    const manager = await User.create({
      firstName: 'Sarah',
      lastName: 'Manager',
      email: 'manager@insightloop.com',
      passwordHash,
      role: Role.MANAGER,
    });

    const members = await User.insertMany([
      { firstName: 'Alice', lastName: 'Developer', email: 'alice@insightloop.com', passwordHash, role: Role.TEAM_MEMBER },
      { firstName: 'Bob', lastName: 'Engineer', email: 'bob@insightloop.com', passwordHash, role: Role.TEAM_MEMBER },
      { firstName: 'Charlie', lastName: 'Designer', email: 'charlie@insightloop.com', passwordHash, role: Role.TEAM_MEMBER },
      { firstName: 'David', lastName: 'QA', email: 'david@insightloop.com', passwordHash, role: Role.TEAM_MEMBER },
      { firstName: 'Eve', lastName: 'Product', email: 'eve@insightloop.com', passwordHash, role: Role.TEAM_MEMBER },
    ]);

    // 2. Projects
    const projects = await Project.insertMany([
      {
        name: 'Project Alpha - Frontend Rewrite',
        description: 'Complete overhaul of the user interface using React and Tailwind.',
        type: 'Development',
        createdBy: manager._id,
        assignedMembers: [members[0]._id, members[2]._id],
      },
      {
        name: 'Project Beta - API Migration',
        description: 'Migrating legacy REST endpoints to GraphQL.',
        type: 'Infrastructure',
        createdBy: admin._id,
        assignedMembers: [members[1]._id],
      },
      {
        name: 'Project Gamma - QA Automation',
        description: 'Setting up Cypress for E2E testing.',
        type: 'Testing',
        createdBy: manager._id,
        assignedMembers: [members[3]._id],
      },
      {
        name: 'General / Operations',
        description: 'Daily operational tasks and maintenance.',
        type: 'Operations',
        createdBy: admin._id,
        assignedMembers: members.map(m => m._id),
      }
    ]);

    // 3. Weeks (Current week and 3 previous weeks)
    const weeks = [];
    const now = new Date();
    // Find the most recent Monday
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
    const currentWeekStart = new Date(now.setDate(diff));
    currentWeekStart.setHours(0,0,0,0);

    for (let i = 0; i < 4; i++) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - (i * 7));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23,59,59,999);
      weeks.unshift({ start, end }); // Oldest first
    }

    // 4. Reports Generation
    
    // Week 1 (Oldest): All approved
    for (const member of members.slice(0, 4)) {
      const report = await Report.create({
        owner: member._id,
        weekStart: weeks[0].start,
        weekEnd: weeks[0].end,
        project: projects[0]._id,
        tasksCompleted: [
          { taskName: 'Initial setup', status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH, plannedPercentage: 100, actualPercentage: 100, plannedHours: 10, spentHours: 10 },
          { taskName: 'Documentation reading', status: TaskStatus.COMPLETED, priority: TaskPriority.MEDIUM, plannedPercentage: 100, actualPercentage: 100, plannedHours: 5, spentHours: 4 }
        ],
        nextWeekTasks: [
          { taskName: 'Start core implementation', status: TaskStatus.NOT_STARTED, priority: TaskPriority.HIGH, plannedPercentage: 0, actualPercentage: 0, plannedHours: 20, spentHours: 0 }
        ],
        blockers: [],
        achievements: [{ description: 'Successfully completed environment setup', isKeyAchievement: true }],
        currentStatus: ReportStatus.APPROVED,
        latestReviewedBy: manager._id,
        latestReviewedAt: new Date(weeks[0].end.getTime() + 86400000),
        currentVersion: 1,
      });

      const version = await ReportVersion.create({
        reportId: report._id,
        versionNumber: 1,
        snapshot: report.toObject(),
        submittedBy: member._id,
        statusAtSubmission: ReportStatus.SUBMITTED,
      });

      await ReviewAction.create({
        reportId: report._id,
        reportVersionId: version._id,
        reviewerId: manager._id,
        action: ReviewActionType.APPROVED,
        comment: 'Great start to the project.',
      });
    }

    // Week 2: Mix of Approved and one Needs Correction
    const r2_1 = await Report.create({
      owner: members[0]._id,
      weekStart: weeks[1].start,
      weekEnd: weeks[1].end,
      project: projects[0]._id,
      tasksCompleted: [
        { taskName: 'UI Components', status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH, plannedPercentage: 100, actualPercentage: 90, plannedHours: 15, spentHours: 18 }
      ],
      nextWeekTasks: [],
      blockers: [{ description: 'Design assets missing', isKeyIssue: true }],
      achievements: [],
      currentStatus: ReportStatus.APPROVED,
      latestReviewedBy: manager._id,
      currentVersion: 1,
    });
    
    await ReportVersion.create({
      reportId: r2_1._id, versionNumber: 1, snapshot: r2_1.toObject(), submittedBy: members[0]._id, statusAtSubmission: ReportStatus.SUBMITTED
    });

    const r2_2 = await Report.create({
      owner: members[1]._id,
      weekStart: weeks[1].start,
      weekEnd: weeks[1].end,
      project: projects[1]._id,
      tasksCompleted: [
        { taskName: 'API Endpoint 1', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, plannedPercentage: 100, actualPercentage: 50, plannedHours: 20, spentHours: 15 }
      ],
      nextWeekTasks: [],
      blockers: [],
      achievements: [],
      currentStatus: ReportStatus.NEEDS_CORRECTION,
      latestReviewComment: 'Please add more details about why the API endpoint is only 50% complete. What are the blockers?',
      latestReviewedBy: manager._id,
      currentVersion: 1,
    });

    const v2_2 = await ReportVersion.create({
      reportId: r2_2._id, versionNumber: 1, snapshot: r2_2.toObject(), submittedBy: members[1]._id, statusAtSubmission: ReportStatus.SUBMITTED
    });

    await ReviewAction.create({
      reportId: r2_2._id, reportVersionId: v2_2._id, reviewerId: manager._id, action: ReviewActionType.CHANGES_REQUESTED, comment: 'Please add more details about why the API endpoint is only 50% complete. What are the blockers?'
    });

    // Week 3: Submitted, Draft
    const r3_1 = await Report.create({
      owner: members[2]._id,
      weekStart: weeks[2].start,
      weekEnd: weeks[2].end,
      project: projects[0]._id,
      tasksCompleted: [
        { taskName: 'Design System', status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH, plannedPercentage: 100, actualPercentage: 100, plannedHours: 20, spentHours: 20 }
      ],
      nextWeekTasks: [],
      blockers: [],
      achievements: [{ description: 'Design system approved by stakeholders', isKeyAchievement: true }],
      currentStatus: ReportStatus.SUBMITTED,
      currentVersion: 1,
    });
    await ReportVersion.create({ reportId: r3_1._id, versionNumber: 1, snapshot: r3_1.toObject(), submittedBy: members[2]._id, statusAtSubmission: ReportStatus.SUBMITTED });

    // Draft for member 3
    await Report.create({
      owner: members[3]._id,
      weekStart: weeks[2].start,
      weekEnd: weeks[2].end,
      project: projects[2]._id,
      tasksCompleted: [
        { taskName: 'Cypress Setup', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, plannedPercentage: 80, actualPercentage: 60, plannedHours: 15, spentHours: 10 }
      ],
      nextWeekTasks: [],
      blockers: [],
      achievements: [],
      currentStatus: ReportStatus.DRAFT,
      currentVersion: 1,
    });

    // Week 4 (Current Week): Mostly Submitted, some Not Started
    await Report.create({
      owner: members[0]._id,
      weekStart: weeks[3].start,
      weekEnd: weeks[3].end,
      project: projects[0]._id,
      tasksCompleted: [
        { taskName: 'Dashboard UI', status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH, plannedPercentage: 100, actualPercentage: 100, plannedHours: 15, spentHours: 14 }
      ],
      nextWeekTasks: [],
      blockers: [],
      achievements: [],
      currentStatus: ReportStatus.SUBMITTED,
      currentVersion: 1,
    });
    // Members 1, 2, 3, 4 have NOT STARTED for current week.

    console.log('Database seeded successfully with 4 weeks of data.');
    console.log('--- Demo Accounts ---');
    console.log('Admin: admin@insightloop.com / password123');
    console.log('Manager: manager@insightloop.com / password123');
    console.log('Member: alice@insightloop.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
