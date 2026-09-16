import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Prisma } from "../../prisma/generated";
import { CreateStudentDto } from "../dtos/student/CreateStudentDto";
import { UpdateStudentDto } from "../dtos/student/UpdateStudentDto";
import { AdmissionNoTakenError, StudentNotFoundError, UnableToDetermineCountryError } from "../errors/AppError";
import * as studentRepo from "../repositories/student.repository";

type Actor = { sub: string, username: string };

const phoneCountryOf = (phone: string): string => {
    const parsed = parsePhoneNumberFromString(phone);
    if (!parsed?.country) throw new UnableToDetermineCountryError();

    return parsed.country;
};

const listStudents = async (page: number, pageSize: number) =>
    await studentRepo.listStudents((page - 1) * pageSize, pageSize);

const getStudentById = async (id: string) => await studentRepo.getStudentById(id);

const createStudent = async (dto: CreateStudentDto, actor: Actor) => {
    const phoneCountry = phoneCountryOf(dto.guardianPhone);

    const admissionNo = await studentRepo.generateAdmissionNo();
    try {
        return await studentRepo.createStudent({
            ...dto,
            admissionNo,
            dateOfBirth: new Date(dto.dateOfBirth),
            phoneCountry,
            createdByUserId: actor.sub,
            createdByUsername: actor.username,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AdmissionNoTakenError();
        }
        throw error;
    }
};


const updateStudent = async (id: string, dto: UpdateStudentDto, actor: Actor) => {

    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    const phoneCountry = phoneCountryOf(dto.guardianPhone);


    return await studentRepo.updateStudent(id, {
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
        phoneCountry,
    });
};


const deleteStudent = async (id: string) => {
    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    return await studentRepo.softDeleteStudent(id);
};

const linkUserToStudent = async (studentId: string, userId: any, loginUsername: string) => {
    const record = await studentRepo.getStudentById(studentId);
    if (!record) throw new StudentNotFoundError();

    return await studentRepo.linkUserToStudent(studentId, userId, loginUsername);
};

const linkedUserIds = async () => await studentRepo.linkedUserIds();


const unlinkUser = async (id: string) => {
    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    return await studentRepo.unlinkUser(id);
};

export {
    createStudent, deleteStudent, getStudentById, listStudents, updateStudent, linkUserToStudent, linkedUserIds, unlinkUser
};
