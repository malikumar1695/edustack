
export type Role = {
    id: string;
    name: string;
};

/** Mirrors the Gender enum in academic-service's Prisma schema. */
export type Gender = "MALE" | "FEMALE" | "OTHER";

export type UserListItem = {
    id: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    locked: boolean;
    roles: Role[];
};

export type StudentListItem = {
    id: string;
    userId?: string;
    loginUsername?: string;
    admissionNo: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    guardianName: string;
    guardianPhone: string;
    countryOfResidence: string;
};


export type ParentListItem = {
    id: string;
    userId?: string;
    loginUsername?: string;
    firstName: string;
    lastName: string;
    /** Optional on the server too — not every guardian has one. */
    email?: string;
    gender: Gender;
    phone: string;
    phoneCountry: string;
    countryOfResidence: string;
    createdAt: string;
    updatedAt: string;
};

export type ClassListItem = {
    id: string;
    name: string;
    subject: string;
    teacherUserId: string;
    teacherUsername: string;
    /** Active (non-deleted) students only. Absent for students: class size is for staff. */
    studentCount?: number;
    createdAt: string;
    updatedAt: string;
};

export type ClassStudent = Pick<StudentListItem, "id" | "admissionNo" | "firstName" | "lastName" | "userId" | "loginUsername">;

export type ClassDetail = Omit<ClassListItem, "studentCount"> & {
    students: ClassStudent[];
};

export type ClassSession = {
    id: string;
    classId: string;
    className: string;
    status: "LIVE" | "ENDED";
    startedByUsername: string;
    startedAt: string;
    endedAt?: string | null;
};

export type StartSessionResponse = ClassSession & {
    /** Enrolled students with no login account, left out of the session. */
    unlinkedStudents: number;
};

export type ParticipantRole = "ADMIN" | "TEACHER" | "STUDENT";

export type JoinTokenResponse = {
    token: string;
    serverUrl: string;
    role: ParticipantRole;
    session: { id: string; className: string };
};

/** The subset of a record LinkUserForm needs — students and parents both fit. */
export type LinkableRecord = {
    id: string;
    userId?: string;
};
