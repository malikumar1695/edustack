import { beforeEach, describe, expect, it, vi } from "vitest";
import { ClassNotFoundError, UnknownStudentsError } from "../errors/AppError";
import * as classRepo from "../repositories/class.repository";
import * as classService from "./class.service";


vi.mock("../lib/prisma", () => ({ prisma: {} }));
vi.mock("../repositories/class.repository");


const admin = { sub: "a0000000-0000-4000-8000-000000000001", username: "admin", roles: ["admin"] };
const teacher = { sub: "t0000000-0000-4000-8000-000000000002", username: "mr.khan", roles: ["teacher"] };
const otherTeacher = { sub: "t0000000-0000-4000-8000-000000000003", username: "ms.ali", roles: ["teacher"] };

const student = {
    id: "s1",
    admissionNo: "STU-000001",
    firstName: "Saqib",
    lastName: "Mehmood",
    userId: null,
    loginUsername: null,
};

const mockedClass = {
    id: "c1",
    name: "Grade 5 — Mathematics",
    subject: "Mathematics",
    teacherUserId: teacher.sub,
    teacherUsername: teacher.username,
    createdByUserId: admin.sub,
    createdByUsername: admin.username,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("list classes", () => {

    it("should list every class for an admin", async () => {
        vi.mocked(classRepo.listClasses).mockResolvedValue({ data: [], total: 0 });

        await classService.listClasses(1, 10, admin);

        expect(classRepo.listClasses).toHaveBeenCalledWith(0, 10, {});
    });

    it("should list only a teacher's own classes", async () => {
        vi.mocked(classRepo.listClasses).mockResolvedValue({ data: [], total: 0 });

        await classService.listClasses(2, 10, teacher);

        expect(classRepo.listClasses).toHaveBeenCalledWith(10, 10, { teacherUserId: teacher.sub });
    });

    it("should list only the classes a student is enrolled in", async () => {
        const studentActor = { sub: "u0000000-0000-4000-8000-000000000004", username: "saqib", roles: ["student"] };
        vi.mocked(classRepo.listClasses).mockResolvedValue({ data: [], total: 0 });

        await classService.listClasses(1, 10, studentActor);

        expect(classRepo.listClasses).toHaveBeenCalledWith(0, 10, { studentUserId: studentActor.sub });
    });

    it("should not tell a student how many are enrolled", async () => {
        const studentActor = { sub: "u0000000-0000-4000-8000-000000000004", username: "saqib", roles: ["student"] };
        vi.mocked(classRepo.listClasses).mockResolvedValue({
            data: [{ ...mockedClass, _count: { enrollments: 3 } }],
            total: 1,
        });

        const result = await classService.listClasses(1, 10, studentActor);

        expect(result.data[0]).not.toHaveProperty("studentCount");
    });

    it("should flatten the enrollment count into studentCount", async () => {
        vi.mocked(classRepo.listClasses).mockResolvedValue({
            data: [{ ...mockedClass, _count: { enrollments: 3 } }],
            total: 1,
        });

        const result = await classService.listClasses(1, 10, admin);

        expect(result.data[0]).toEqual({ ...mockedClass, studentCount: 3 });
        expect(result.data[0]).not.toHaveProperty("_count");
    });
});

describe("get class", () => {

    it("should return the class with its students to its teacher", async () => {
        vi.mocked(classRepo.getClassWithStudents).mockResolvedValue({
            ...mockedClass,
            enrollments: [{ student }],
        });

        const result = await classService.getClass("c1", teacher);

        expect(result.students).toEqual([student]);
        expect(result).not.toHaveProperty("enrollments");
    });

    it("should report another teacher's class as not found", async () => {
        vi.mocked(classRepo.getClassWithStudents).mockResolvedValue({ ...mockedClass, enrollments: [] });

        await expect(classService.getClass("c1", otherTeacher)).rejects.toThrow(ClassNotFoundError);
    });

    it("should let an admin read any class", async () => {
        vi.mocked(classRepo.getClassWithStudents).mockResolvedValue({ ...mockedClass, enrollments: [] });

        await expect(classService.getClass("c1", admin)).resolves.toMatchObject({ id: "c1" });
    });
});

describe("add enrollments", () => {

    it("should add only the given students", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);
        vi.mocked(classRepo.countActiveStudents).mockResolvedValue(1);

        await classService.addEnrollments("c1", ["s1"], teacher);

        expect(classRepo.addEnrollments).toHaveBeenCalledWith("c1", ["s1"]);
        expect(classRepo.setEnrollments).not.toHaveBeenCalled();
    });

    it("should reject a missing or soft-deleted student", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);
        vi.mocked(classRepo.countActiveStudents).mockResolvedValue(0);

        await expect(classService.addEnrollments("c1", ["s1"], admin)).rejects.toThrow(UnknownStudentsError);
        expect(classRepo.addEnrollments).not.toHaveBeenCalled();
    });

    it("should report another teacher's class as not found", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);

        await expect(classService.addEnrollments("c1", ["s1"], otherTeacher)).rejects.toThrow(ClassNotFoundError);
        expect(classRepo.addEnrollments).not.toHaveBeenCalled();
    });
});

describe("remove enrollment", () => {

    it("should remove only the given student", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);

        await classService.removeEnrollment("c1", "s1", teacher);

        expect(classRepo.removeEnrollment).toHaveBeenCalledWith("c1", "s1");
    });

    it("should report another teacher's class as not found", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);

        await expect(classService.removeEnrollment("c1", "s1", otherTeacher)).rejects.toThrow(ClassNotFoundError);
        expect(classRepo.removeEnrollment).not.toHaveBeenCalled();
    });
});

describe("set enrollments", () => {

    it("should throw ClassNotFoundError when the class does not exist", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(null);

        await expect(classService.setEnrollments("missing", ["s1"], admin)).rejects.toThrow(ClassNotFoundError);
        expect(classRepo.setEnrollments).not.toHaveBeenCalled();
    });

    it("should let a teacher change the roster of their own class", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);
        vi.mocked(classRepo.getClassWithStudents).mockResolvedValue({ ...mockedClass, enrollments: [] });

        await classService.setEnrollments("c1", [], teacher);

        expect(classRepo.setEnrollments).toHaveBeenCalledWith("c1", []);
    });

    it("should report another teacher's class as not found", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);

        await expect(classService.setEnrollments("c1", [], otherTeacher)).rejects.toThrow(ClassNotFoundError);
        expect(classRepo.setEnrollments).not.toHaveBeenCalled();
    });

    it("should reject the roster when any student is missing or soft-deleted", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);
        vi.mocked(classRepo.countActiveStudents).mockResolvedValue(1);

        await expect(classService.setEnrollments("c1", ["s1", "s2"], admin)).rejects.toThrow(UnknownStudentsError);
        expect(classRepo.setEnrollments).not.toHaveBeenCalled();
    });

    it("should allow clearing the roster without looking up students", async () => {
        vi.mocked(classRepo.getClassById).mockResolvedValue(mockedClass);
        vi.mocked(classRepo.getClassWithStudents).mockResolvedValue({ ...mockedClass, enrollments: [] });

        const result = await classService.setEnrollments("c1", [], admin);

        expect(classRepo.countActiveStudents).not.toHaveBeenCalled();
        expect(classRepo.setEnrollments).toHaveBeenCalledWith("c1", []);
        expect(result.students).toEqual([]);
    });
});
