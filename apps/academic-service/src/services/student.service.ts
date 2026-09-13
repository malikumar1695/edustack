import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as studentRepo from "../repositories/student.repository";
import { CreateStudentDto } from "../dtos/student/CreateStudentDto";
import { Prisma } from "../../prisma/generated";
import { AdmissionNoTakenError, ValidationError, StudentNotFoundError, UnableToDetermineCountryError } from "../errors/AppError";
import { UpdateStudentDto } from "../dtos/student/UpdateStudentDto";

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

    try {
        return await studentRepo.updateStudent(id, {
            ...dto,
            dateOfBirth: new Date(dto.dateOfBirth),
            phoneCountry,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AdmissionNoTakenError();
        }
        throw error;
    }
};


const deleteStudent = async (id: string) => {
    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    return await studentRepo.softDeleteStudent(id);
};

export {
    listStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};