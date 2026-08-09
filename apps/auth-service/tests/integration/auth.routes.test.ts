import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { accountRouter } from "../../src/controllers/account.controller";
import { prisma } from "../../src/lib/prisma";
import { errorHandler } from "../../src/middlewares/error.middleware";
import { requestLogger } from "../../src/middlewares/request-logger.middleware";

const buildApp = () => {
    const app = express();
    app.use(requestLogger);
    app.use(express.json());
    app.use(cookieParser());
    app.use("/auth", accountRouter);
    app.use(errorHandler);
    return app;
}

const app = buildApp();

beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
});

describe("POST /auth/register + /auth/login", () => {
    it("registers a new user and logs in successfully", async () => {

        const registerResponse = await request(app).post("/auth/register")
            .send({ username: "testuser", password: "testpassword" });

        expect(registerResponse.status).toBe(201);
        expect(registerResponse.body).toHaveProperty("accessToken");
        expect(registerResponse.headers['set-cookie'][0]).toMatch(/refreshToken=/);

        const loginResponse = await request(app).post("/auth/login")
            .send({ username: "testuser", password: "testpassword" });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty("accessToken");

    });

    it("rejects a duplicate username with 409 status", async () => {
        await request(app).post("/auth/register")
            .send({ username: "testuser", password: "testpassword" });

        const duplicateResponse = await request(app).post("/auth/register")
            .send({ username: "testuser", password: "testpassword" });

        expect(duplicateResponse.status).toBe(409);
        expect(duplicateResponse.body.error.code).toBe("USERNAME_TAKEN");
    });

    it("rejects a malformed body with 400 validation details", async () => {

        const res = await request(app).post("/auth/login")
            .send({ username: "testuser" }); // missing password

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
        expect(res.body.error.requestId).toBeDefined();
    });

    describe("login rate limiting", () => {
        it("returns 429 Too Many Requests after exceeding the limit", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app).post("/auth/login")
                    .send({ username: "nonexistent", password: "wrong" });
            }
            const rateLimitResponse = await request(app).post("/auth/login")
                .send({ username: "nonexistent", password: "wrong" });
            expect(rateLimitResponse.status).toBe(429);
        });
    });
});