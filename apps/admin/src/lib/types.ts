
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

/** The subset of a record LinkUserForm needs — students and parents both fit. */
export type LinkableRecord = {
    id: string;
    userId?: string;
};
