import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import { AdmissionNoTakenError, StudentNotFoundError, UnableToDetermineCountryError } from "../errors/AppError";
import * as studentRepo from "../repositories/student.repository";
import { relayOutboxInBackground } from "./outbox.service";
import * as studentService from "./student.service";
import { Gender, Prisma, Student } from "../../prisma/generated";


vi.mock("../lib/prisma", () => ({ prisma: {} }));
vi.mock("../repositories/student.repository");
// createStudent fires a background relay. Stub it so the tests don't reach SNS.
vi.mock("./outbox.service", () => ({ relayOutboxInBackground: vi.fn() }));


const prismaError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError("db error", { code, clientVersion: "test" });

const validStudentData = {
    firstName: "Saqib",
    lastName: "Mehmood",
    dateOfBirth: "2019-05-15T00:00:00.000Z",
    gender: Gender.MALE,
    guardianName: "Ali",
    guardianPhone: "+923355247852",
    countryOfResidence: "PK"
};

const actor = {
    sub: "ab804b5c-38a3-431c-b274-3930d4834603",
    username: "admin"
};

const mockedStudent = {
    id: "s1",
    admissionNo: "STU-000002",
    firstName: "Saqib",
    lastName: "Mehmood",
    dateOfBirth: new Date("2019-05-15T00:00:00.000Z"),
    gender: Gender.MALE,
    guardianName: "Ali",
    guardianPhone: "+923325365478",
    phoneCountry: "PK",
    countryOfResidence: "PK",
    userId: null,
    loginUsername: null,
    createdByUserId: actor.sub,
    createdByUsername: actor.username,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
} satisfies Student;

describe("create student", () => {

    it("should throw UnableToDetermineCountryError when creating a student with invalid guardian phone", async () => {

        const InValidStudentData = {
            firstName: "Saqib",
            lastName: "Mehmood",
            dateOfBirth: "2019-05-15T00:00:00.000Z",
            gender: Gender.MALE,
            guardianName: "Ali",
            guardianPhone: "3355247852",
            countryOfResidence: "PK"
        };
        await expect(studentService.createStudent(InValidStudentData, actor)).rejects.toThrowError(UnableToDetermineCountryError);

        expect(studentRepo.generateAdmissionNo).not.toHaveBeenCalled();
        expect(studentRepo.createStudentWithEvent).not.toHaveBeenCalled();
    });


    it("should give AdmissionNoTakenError on creating a student with an already taken admission number", async () => {
        vi.resetAllMocks();

        vi.mocked(studentRepo.generateAdmissionNo).mockResolvedValue("STU-000001");
        vi.mocked(studentRepo.createStudentWithEvent).mockRejectedValue(
            prismaError("P2002")
        );

        await expect(studentService.createStudent(validStudentData, actor)).rejects.toThrowError(AdmissionNoTakenError);
        expect(studentRepo.generateAdmissionNo).toHaveBeenCalled();
        expect(studentRepo.createStudentWithEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                admissionNo: "STU-000001",
                firstName: validStudentData.firstName,
                lastName: validStudentData.lastName,
                gender: validStudentData.gender,
                guardianName: validStudentData.guardianName,
                guardianPhone: validStudentData.guardianPhone,
                countryOfResidence: validStudentData.countryOfResidence,
                dateOfBirth: new Date(validStudentData.dateOfBirth),
                phoneCountry: "PK",
                createdByUserId: actor.sub,
                createdByUsername: actor.username,
            }),
            expect.any(Function),
        );
    });

    it("should create a student successfully when given valid data", async () => {
        vi.resetAllMocks();

        vi.mocked(studentRepo.generateAdmissionNo).mockResolvedValue("STU-000002");
        vi.mocked(studentRepo.createStudentWithEvent).mockResolvedValue(mockedStudent);

        const result = await studentService.createStudent(validStudentData, actor);
        expect(result).toEqual(mockedStudent);

        expect(studentRepo.generateAdmissionNo).toHaveBeenCalled();
        expect(studentRepo.createStudentWithEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                admissionNo: "STU-000002",
                firstName: validStudentData.firstName,
                lastName: validStudentData.lastName,
                gender: validStudentData.gender,
                guardianName: validStudentData.guardianName,
                guardianPhone: validStudentData.guardianPhone,
                countryOfResidence: validStudentData.countryOfResidence,
                dateOfBirth: new Date(validStudentData.dateOfBirth),
                phoneCountry: "PK",
                createdByUserId: actor.sub,
                createdByUsername: actor.username,
            }),
            expect.any(Function),
        );
    });

    it("should describe the committed student in the outbox event", async () => {
        vi.resetAllMocks();

        vi.mocked(studentRepo.generateAdmissionNo).mockResolvedValue("STU-000002");
        vi.mocked(studentRepo.createStudentWithEvent).mockResolvedValue(mockedStudent);

        await studentService.createStudent(validStudentData, actor);

        // The repository calls this inside the transaction with the row it just
        // wrote, so the event always carries the real id rather than a guess.
        const [, buildEvent] = vi.mocked(studentRepo.createStudentWithEvent).mock.calls[0];

        expect(buildEvent(mockedStudent)).toEqual({
            type: "student.created",
            payload: {
                studentId: mockedStudent.id,
                admissionNo: mockedStudent.admissionNo,
                firstName: mockedStudent.firstName,
                lastName: mockedStudent.lastName,
            },
        });
    });

    it("should nudge the outbox relay after a successful create", async () => {
        vi.resetAllMocks();

        vi.mocked(studentRepo.generateAdmissionNo).mockResolvedValue("STU-000002");
        vi.mocked(studentRepo.createStudentWithEvent).mockResolvedValue(mockedStudent);

        await studentService.createStudent(validStudentData, actor);

        expect(relayOutboxInBackground).toHaveBeenCalledOnce();
    });
});

describe("update Student ", () => {

    it("should throw an error StudentNotFoundError if the student does not exist", async () => {
        vi.mocked(studentRepo.getStudentById).mockResolvedValue(null);


        await expect(studentService.updateStudent("non-existent-id", validStudentData, actor))
            .rejects.toThrow(StudentNotFoundError);

        expect(studentRepo.getStudentById).toHaveBeenCalledWith("non-existent-id");
    });

});