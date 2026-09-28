import { Gender, Prisma, Student } from "../../prisma/generated";
import { prisma } from "../lib/prisma";


type StudentWriteData = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    guardianName: string;
    guardianPhone: string;
    phoneCountry: string;
    countryOfResidence: string;
    userId?: string;
};

type OutboxEventInput = { type: string; payload: Prisma.InputJsonValue };


const listStudents = async (skip: number, take: number) => {
    const where: Prisma.StudentWhereInput = { isDeleted: false };
    const orderBy: Prisma.StudentOrderByWithRelationInput = { createdAt: "desc" };

    const [data, total] = await prisma.$transaction([
        prisma.student.findMany({ where, skip, take, orderBy }),
        prisma.student.count({ where }),
    ],
        {
            // Cloud Run scales to zero and Neon suspends idle computes, so the
            // first request after a quiet period waits on both waking up.
            // Prisma's 2s default maxWait is well short of that, which made
            // cold visitors hit "Unable to start a transaction in the given time".
            maxWait: 15_000,
            timeout: 20_000,
        },
    );
    return { data, total };
};

const getStudentById = async (id: string) => {
    const student = await prisma.student.findUnique({
        where: { id, isDeleted: false },
    });
    return student;
};

const generateAdmissionNo = async (): Promise<string> => {
    const [{ nextval }] = await prisma.$queryRaw<{ nextval: bigint }[]>`
    SELECT nextval('admissionno_seq') AS nextval
`;
    const admissionNo = `STU-${String(nextval).padStart(6, "0")}`;
    // → STU-000001, STU-000002, ...
    return admissionNo;
};
const createStudentWithEvent = async (data: StudentWriteData & {
    admissionNo: string;
    createdByUserId: string;
    createdByUsername: string;
}, buildEvent: (student: Student) => OutboxEventInput
) => {
 // The entire fix: both rows commit or neither does, so the event can no
    // longer be lost after the student is already persisted.
    return await prisma.$transaction(
        async (tx) => {
            const student = await tx.student.create({ data });
            await tx.outboxEvent.create({ data: buildEvent(student) });
            return student;
        },
        // Same cold-start allowance as listStudents — Cloud Run scales to zero
        // and Neon suspends idle computes.
        { maxWait: 15_000, timeout: 20_000 },
    );
};

const updateStudent = async (id: string, data: StudentWriteData) => {
    return await prisma.student.update({ where: { id }, data });
};

const softDeleteStudent = async (id: string) =>
    await prisma.student.update({ where: { id }, data: { isDeleted: true } });

const linkedUserIds = async (): Promise<string[]> => {
    const rows = await prisma.student.findMany({
        where: { isDeleted: false, userId: { not: null } },
        select: { userId: true },
    });

    return rows.map((row) => row.userId!);
};


const linkUserToStudent = async (studentId: string, userId: string, loginUsername: string) => {
    return await prisma.student.update({
        where: { id: studentId },
        data: { userId, loginUsername },
    });
};

const unlinkUser = async (id: string) => {
    return await prisma.student.update({
        where: { id },
        data: { userId: null, loginUsername: null },
    });
};

export { listStudents, getStudentById, createStudentWithEvent, generateAdmissionNo, linkUserToStudent, updateStudent, softDeleteStudent, linkedUserIds, unlinkUser };

