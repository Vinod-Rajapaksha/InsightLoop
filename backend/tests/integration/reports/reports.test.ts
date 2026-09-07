import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../../src/app';
import { User, Role } from '../../../src/models/User';
import { Report, ReportStatus } from '../../../src/models/Report';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Report.deleteMany({});
});

describe('Report Integration Endpoints', () => {
  it('should return 401 if unauthenticated user attempts to create a report', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({
        weekStartDate: '2026-09-01',
        achievements: 'Completed backend integration tests',
      });

    expect(res.status).toBe(401);
  });
});
