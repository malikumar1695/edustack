import { Gender } from "../../prisma/generated";
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

const listStudents = async (skip: number, take: number) => {
    const where = { isDeleted: false };
    const [data, total] = await Promise.all([
        prisma.student.findMany({ where, skip, take }),
        prisma.student.count({ where }),
    ]);
    return { data, total };
};

const getStudentById = async (id: string) => {
    const student = await prisma.student.findUnique({
        where: { id },
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
const createStudent = async (data: StudentWriteData & {
    admissionNo: string;
    createdByUserId: string;
    createdByUsername: string;
},
) => {
    const student = await prisma.student.create({ data });
    return student;
};

export const updateStudent = (id: string, data: StudentWriteData) =>
    prisma.student.update({ where: { id }, data });

export const softDeleteStudent = (id: string) =>
    prisma.student.update({ where: { id }, data: { isDeleted: true } });


export { listStudents, getStudentById, createStudent, generateAdmissionNo };
