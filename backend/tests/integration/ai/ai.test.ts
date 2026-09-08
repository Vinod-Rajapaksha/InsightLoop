import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "../../../src/config/env";
import { User, Role } from "../../../src/models/User";
import jwt from "jsonwebtoken";

jest.mock("../../../src/modules/ai/agent/GeminiService", () => ({
  geminiService: {
    isConfigured: jest.fn().mockReturnValue(true),
    generateResponse: jest.fn().mockResolvedValue({
      answer: "Mock AI Response",
      insights: [],
    }),
  },
}));

import request from "supertest";
import app from "../../../src/app";

let mongoServer: MongoMemoryServer;
let managerToken: string;
let memberToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const manager = await User.create({
    firstName: "Manager",
    lastName: "Test",
    email: "manager@test.com",
    passwordHash: "hash",
    role: Role.MANAGER,
  });

  const member = await User.create({
    firstName: "Member",
    lastName: "Test",
    email: "member@test.com",
    passwordHash: "hash",
    role: Role.TEAM_MEMBER,
  });

  managerToken = jwt.sign(
    { id: manager._id, role: manager.role },
    env.JWT_SECRET,
  );
  memberToken = jwt.sign({ id: member._id, role: member.role }, env.JWT_SECRET);
});

afterAll(async () => {
  jest.clearAllMocks();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("AI Endpoints Integration", () => {
  it("should return 401 if not authenticated", async () => {
    const res = await request(app)
      .post("/api/ai/weekly-summary")
      .send({ weekStart: "2026-09-01", weekEnd: "2026-09-07" });
    expect(res.status).toBe(401);
  });

  it("should return 403 for TEAM_MEMBER", async () => {
    const res = await request(app)
      .post("/api/ai/weekly-summary")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ weekStart: "2026-09-01", weekEnd: "2026-09-07" });

    expect(res.status).toBe(403);
  });

  it("should process request successfully for MANAGER", async () => {
    const res = await request(app)
      .post("/api/ai/weekly-summary")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ weekStart: "2026-09-01", weekEnd: "2026-09-07" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.answer).toBe("Mock AI Response");
  });

  it("should return AI status", async () => {
    const res = await request(app)
      .get("/api/ai/status")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("provider", "gemini");
    expect(res.body.data).toHaveProperty("ragEnabled", true);
  });
});
