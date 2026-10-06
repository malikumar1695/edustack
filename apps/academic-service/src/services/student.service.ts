import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Prisma } from "../../prisma/generated";
import { CreateStudentDto } from "../dtos/student/CreateStudentDto";
import { UpdateStudentDto } from "../dtos/student/UpdateStudentDto";
import { AdmissionNoTakenError, StudentNotFoundError, UnableToDetermineCountryError, UserAlreadyLinkedError } from "../errors/AppError";
import * as studentRepo from "../repositories/student.repository";
import { relayOutboxInBackground } from "./outbox.service";
import { bumpCacheVersion, cacheGet, cacheSet, cacheVersion } from "../lib/cache";

type Actor = { sub: string, username: string };

const phoneCountryOf = (phone: string): string => {
    const parsed = parsePhoneNumberFromString(phone);
    if (!parsed?.country) throw new UnableToDetermineCountryError();

    return parsed.country;
};


const STUDENTS_NAMESPACE = "students";
const LIST_TTL_SECONDS = 60;

const listStudents = async (page: number, pageSize: number) => {
    const version = await cacheVersion(STUDENTS_NAMESPACE);
    const key = `${STUDENTS_NAMESPACE}:list:v${version}:${page}:${pageSize}`;

    const cached = await cacheGet<Awaited<ReturnType<typeof studentRepo.listStudents>>>(key);
    if (cached) return cached;

    const result = await studentRepo.listStudents((page - 1) * pageSize, pageSize);
    await cacheSet(key, result, LIST_TTL_SECONDS);

    return result;
};

const getStudentById = async (id: string) => await studentRepo.getStudentById(id);

const createStudent = async (dto: CreateStudentDto, actor: Actor) => {
    const phoneCountry = phoneCountryOf(dto.guardianPhone);
    const admissionNo = await studentRepo.generateAdmissionNo();

    let student: Awaited<ReturnType<typeof studentRepo.createStudentWithEvent>>;

    try {
        student = await studentRepo.createStudentWithEvent(
            {
                ...dto,
                admissionNo,
                dateOfBirth: new Date(dto.dateOfBirth),
                phoneCountry,
                createdByUserId: actor.sub,
                createdByUsername: actor.username,
            },
            (created) => ({
                type: "student.created",
                payload: {
                    studentId: created.id,
                    admissionNo: created.admissionNo,
                    firstName: created.firstName,
                    lastName: created.lastName,
                },
            }),
        );
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AdmissionNoTakenError();
        }
        throw error;
    }

    // Both publishes the event just committed and sweeps any earlier ones that
    // previously failed.
    relayOutboxInBackground();
    await bumpCacheVersion(STUDENTS_NAMESPACE);
    return student;
};



const updateStudent = async (id: string, dto: UpdateStudentDto, actor: Actor) => {

    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    const phoneCountry = phoneCountryOf(dto.guardianPhone);


    const student = await studentRepo.updateStudent(id, {
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
        phoneCountry,
    });
    await bumpCacheVersion(STUDENTS_NAMESPACE);
    return student;
};


const deleteStudent = async (id: string) => {
    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    const student = await studentRepo.softDeleteStudent(id);
    await bumpCacheVersion(STUDENTS_NAMESPACE);
    return student;
};

const linkUserToStudent = async (studentId: string, userId: string, loginUsername: string) => {
    const record = await studentRepo.getStudentById(studentId);
    if (!record) throw new StudentNotFoundError();

    try {
        const student = await studentRepo.linkUserToStudent(studentId, userId, loginUsername);
        await bumpCacheVersion(STUDENTS_NAMESPACE);
        return student;
    } catch (error) {
        // Student.userId is @unique — the client-side filter is UX, this is the
        // guarantee. Two admins picking the same account land here.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new UserAlreadyLinkedError();
        }
        throw error;
    }
};

const linkedUserIds = async () => await studentRepo.linkedUserIds();


const unlinkUser = async (id: string) => {
    const record = await studentRepo.getStudentById(id);
    if (!record) throw new StudentNotFoundError();

    const student = await studentRepo.unlinkUser(id);
    await bumpCacheVersion(STUDENTS_NAMESPACE);
    return student;
};

export {
    createStudent, deleteStudent, getStudentById, linkedUserIds, linkUserToStudent, listStudents, unlinkUser, updateStudent
};

