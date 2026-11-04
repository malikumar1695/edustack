import { CreateClassDto } from "../dtos/class/CreateClassDto";
import { UpdateClassDto } from "../dtos/class/UpdateClassDto";
import { ClassNotFoundError, UnknownStudentsError } from "../errors/AppError";
import * as classRepo from "../repositories/class.repository";

type Actor = { sub: string, username: string, roles: string[] };

const isAdmin = (actor: Actor) => actor.roles.includes("admin");
const isTeacher = (actor: Actor) => actor.roles.includes("teacher");

const listClasses = async (page: number, pageSize: number, actor: Actor) => {
    // Admins see every class, teachers the classes they teach, students the
    // classes they're enrolled in.
    const scope = isAdmin(actor) ? {}
        : isTeacher(actor) ? { teacherUserId: actor.sub }
        : { studentUserId: actor.sub };
    const { data, total } = await classRepo.listClasses((page - 1) * pageSize, pageSize, scope);

    return {
        // Class size is for staff; a student gets the class without it.
        data: data.map(({ _count, ...rest }) => "studentUserId" in scope
            ? rest
            : { ...rest, studentCount: _count.enrollments }),
        total,
    };
};

const getClass = async (id: string, actor: Actor) => {
    const record = await classRepo.getClassWithStudents(id);

    // Another teacher's class is reported as not found rather than forbidden,
    // so the response doesn't confirm that the id exists.
    if (!record || (!isAdmin(actor) && record.teacherUserId !== actor.sub)) {
        throw new ClassNotFoundError();
    }

    const { enrollments, ...rest } = record;
    return { ...rest, students: enrollments.map((e) => e.student) };
};

const createClass = async (dto: CreateClassDto, actor: Actor) => {
    return await classRepo.createClass({
        ...dto,
        createdByUserId: actor.sub,
        createdByUsername: actor.username,
    });
};

const updateClass = async (id: string, dto: UpdateClassDto) => {
    const record = await classRepo.getClassById(id);
    if (!record) throw new ClassNotFoundError();

    return await classRepo.updateClass(id, dto);
};

const deleteClass = async (id: string) => {
    const record = await classRepo.getClassById(id);
    if (!record) throw new ClassNotFoundError();

    return await classRepo.softDeleteClass(id);
};

/** Same rule as getClass: a teacher manages only their own class, and another teacher's class reads as not found. */
const assertCanManageRoster = async (id: string, actor: Actor) => {
    const record = await classRepo.getClassById(id);
    if (!record || (!isAdmin(actor) && record.teacherUserId !== actor.sub)) {
        throw new ClassNotFoundError();
    }
};

const assertStudentsActive = async (studentIds: string[]) => {
    // The foreign key already rejects ids that never existed; this also
    // rejects soft-deleted students, which the database would accept.
    if (studentIds.length > 0 && await classRepo.countActiveStudents(studentIds) !== studentIds.length) {
        throw new UnknownStudentsError();
    }
};

const setEnrollments = async (id: string, studentIds: string[], actor: Actor) => {
    await assertCanManageRoster(id, actor);
    await assertStudentsActive(studentIds);

    await classRepo.setEnrollments(id, studentIds);
    return await getClass(id, actor);
};

const addEnrollments = async (id: string, studentIds: string[], actor: Actor) => {
    await assertCanManageRoster(id, actor);
    await assertStudentsActive(studentIds);

    await classRepo.addEnrollments(id, studentIds);
};

const removeEnrollment = async (id: string, studentId: string, actor: Actor) => {
    await assertCanManageRoster(id, actor);

    await classRepo.removeEnrollment(id, studentId);
};

export {
    addEnrollments, createClass, deleteClass, getClass, listClasses, removeEnrollment, setEnrollments, updateClass
};
