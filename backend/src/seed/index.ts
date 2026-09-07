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

    // Users
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@workpulse.com',
      passwordHash,
      role: Role.ADMIN,
    });

    const manager = await User.create({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@workpulse.com',
      passwordHash,
      role: Role.MANAGER,
    });

    const members = await User.insertMany([
      { firstName: 'Alice', lastName: 'Developer', email: 'alice@workpulse.com', passwordHash, role: Role.TEAM_MEMBER },
      { firstName: 'Bob', lastName: 'Engineer', email: 'bob@workpulse.com', passwordHash, role: Role.TEAM_MEMBER },
      { firstName: 'Charlie', lastName: 'Designer', email: 'charlie@workpulse.com', passwordHash, role: Role.TEAM_MEMBER },
    ]);

    // Projects
    const p1 = await Project.create({
      name: 'Frontend Redesign',
      description: 'Revamping the core UI',
      type: 'Development',
      createdBy: manager._id,
      assignedMembers: [members[0]._id, members[2]._id],
    });

    const p2 = await Project.create({
      name: 'Backend API Migration',
      description: 'Moving to GraphQL',
      type: 'Infrastructure',
      createdBy: admin._id,
      assignedMembers: [members[1]._id],
    });

    // Reports
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // 1. Draft Report
    await Report.create({
      owner: members[0]._id,
      weekStart: lastWeek,
      weekEnd: new Date(),
      project: p1._id,
      tasksCompleted: [
        { taskName: 'Design System Update', status: TaskStatus.COMPLETED, plannedPercentage: 100, actualPercentage: 100, plannedHours: 10, spentHours: 12 },
      ],
      nextWeekTasks: [],
      blockers: [],
      achievements: [{ description: 'Finished components', isKeyAchievement: true }],
      currentStatus: ReportStatus.DRAFT,
      currentVersion: 1,
    });

    // 2. Submitted Report
    const r2 = await Report.create({
      owner: members[1]._id,
      weekStart: lastWeek,
      weekEnd: new Date(),
      project: p2._id,
      tasksCompleted: [
        { taskName: 'API Schema Definition', status: TaskStatus.COMPLETED, plannedPercentage: 100, actualPercentage: 100, plannedHours: 8, spentHours: 8 },
      ],
      nextWeekTasks: [],
      blockers: [{ description: 'Waiting on DevOps', isKeyIssue: true }],
      achievements: [],
      currentStatus: ReportStatus.SUBMITTED,
      currentVersion: 1,
    });

    await ReportVersion.create({
      reportId: r2._id,
      versionNumber: 1,
      snapshot: r2.toObject(),
      submittedBy: members[1]._id,
      statusAtSubmission: ReportStatus.DRAFT,
    });

    // 3. Approved Report
    const r3 = await Report.create({
      owner: members[2]._id,
      weekStart: lastWeek,
      weekEnd: new Date(),
      project: p1._id,
      tasksCompleted: [],
      nextWeekTasks: [],
      blockers: [],
      achievements: [],
      currentStatus: ReportStatus.APPROVED,
      latestReviewedBy: manager._id,
      latestReviewedAt: new Date(),
      currentVersion: 1,
    });

    await ReportVersion.create({
      reportId: r3._id,
      versionNumber: 1,
      snapshot: r3.toObject(),
      submittedBy: members[2]._id,
      statusAtSubmission: ReportStatus.DRAFT,
    });

    await ReviewAction.create({
      reportId: r3._id,
      reportVersionId: r3._id, // mock
      reviewerId: manager._id,
      action: ReviewActionType.APPROVED,
      comment: 'Looks good',
    });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
