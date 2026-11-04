import { Prisma } from "../../prisma/generated";
import { prisma } from "../lib/prisma";


type ClassWriteData = {
    name: string;
    subject: string;
    teacherUserId: string;
    teacherUsername: string;
};

// A soft-deleted student is no longer on the roster, but the Enrollment row
// stays so history survives — every read filters it out instead.
const activeEnrollments: Prisma.EnrollmentWhereInput = { student: { isDeleted: false } };


/** Narrows a class list to one teacher's classes or one student's; empty means all. */
type ClassScope = { teacherUserId?: string; studentUserId?: string };

const listClasses = async (skip: number, take: number, scope: ClassScope = {}) => {
    const where: Prisma.ClassWhereInput = {
        isDeleted: false,
        ...(scope.teacherUserId ? { teacherUserId: scope.teacherUserId } : {}),
        // Student.userId is the login account linked to the student record.
        ...(scope.studentUserId
            ? { enrollments: { some: { student: { userId: scope.studentUserId, isDeleted: false } } } }
            : {}),
    };
    const orderBy: Prisma.ClassOrderByWithRelationInput = { createdAt: "desc" };

    const [data, total] = await prisma.$transaction([
        prisma.class.findMany({
            where, skip, take, orderBy,
            include: { _count: { select: { enrollments: { where: activeEnrollments } } } },
        }),
        prisma.class.count({ where }),
    ],
        {
            // Same cold-start allowance as listStudents — Cloud Run scales to
            // zero and Neon suspends idle computes.
            maxWait: 15_000,
            timeout: 20_000,
        },
    );
    return { data, total };
};

const getClassById = async (id: string) => {
    return await prisma.class.findUnique({
        where: { id, isDeleted: false },
    });
};

const getClassWithStudents = async (id: string) => {
    return await prisma.class.findUnique({
        where: { id, isDeleted: false },
        include: {
            enrollments: {
                where: activeEnrollments,
                orderBy: { createdAt: "asc" },
                select: {
                    student: {
                        select: { id: true, admissionNo: true, firstName: true, lastName: true, userId: true, loginUsername: true },
                    },
                },
            },
        },
    });
};

const createClass = async (data: ClassWriteData & {
    createdByUserId: string;
    createdByUsername: string;
}) => {
    return await prisma.class.create({ data });
};

const updateClass = async (id: string, data: ClassWriteData) => {
    return await prisma.class.update({ where: { id }, data });
};

const softDeleteClass = async (id: string) =>
    await prisma.class.update({ where: { id }, data: { isDeleted: true } });

const countActiveStudents = async (ids: string[]) => {
    return await prisma.student.count({
        where: { id: { in: ids }, isDeleted: false },
    });
};

const setEnrollments = async (classId: string, studentIds: string[]) => {
    // Remove-then-add in one transaction, so a reader never sees a roster
    // that's half old and half new.
    await prisma.$transaction(
        async (tx) => {
            await tx.enrollment.deleteMany({
                where: { classId, studentId: { notIn: studentIds } },
            });
            // skipDuplicates keeps existing rows, and with them their
            // original enrollment date.
            await tx.enrollment.createMany({
                data: studentIds.map((studentId) => ({ classId, studentId })),
                skipDuplicates: true,
            });
        },
        { maxWait: 15_000, timeout: 20_000 },
    );
};

const addEnrollments = async (classId: string, studentIds: string[]) => {
    // skipDuplicates makes adding someone already enrolled a no-op.
    await prisma.enrollment.createMany({
        data: studentIds.map((studentId) => ({ classId, studentId })),
        skipDuplicates: true,
    });
};

const removeEnrollment = async (classId: string, studentId: string) => {
    // deleteMany, not delete: removing someone already gone isn't an error.
    await prisma.enrollment.deleteMany({ where: { classId, studentId } });
};

export {
    addEnrollments, countActiveStudents, createClass, getClassById, getClassWithStudents, listClasses, removeEnrollment, setEnrollments, softDeleteClass, updateClass
};
