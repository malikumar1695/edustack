import { Gender, Prisma } from "../../prisma/generated";
import { prisma } from "../lib/prisma";


type ParentWriteData = {
    firstName: string;
    lastName: string;
    gender: Gender;
    email?: string;
    phone: string;
    phoneCountry: string;
    countryOfResidence: string;
};


const listParents = async (skip: number, take: number) => {
    const where: Prisma.ParentWhereInput = { isDeleted: false };
    const orderBy: Prisma.ParentOrderByWithRelationInput = { createdAt: "desc" };

    const [data, total] = await prisma.$transaction([
        prisma.parent.findMany({ where, skip, take, orderBy }),
        prisma.parent.count({ where }),
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

const getParentById = async (id: string) => {
    const parent = await prisma.parent.findUnique({
        where: { id, isDeleted: false },
    });
    return parent;
};


// No outbox event here, unlike createStudentWithEvent: nothing subscribes to a
// parent being created, and emitting an event with no SNS topic behind it would
// leave a row the relay can never publish. The event worth emitting is the
// parent-to-student link, once there is a consumer to receive it.
const createParent = async (data: ParentWriteData & {
    createdByUserId: string;
    createdByUsername: string;
}) => {
    return await prisma.parent.create({ data });
};

const updateParent = async (id: string, data: ParentWriteData) => {
    return await prisma.parent.update({ where: { id }, data });
};

const softDeleteParent = async (id: string) =>
    await prisma.parent.update({ where: { id }, data: { isDeleted: true } });

const linkedUserIds = async (): Promise<string[]> => {
    const rows = await prisma.parent.findMany({
        where: { isDeleted: false, userId: { not: null } },
        select: { userId: true },
    });

    return rows.map((row) => row.userId!);
};


const linkUserToParent = async (parentId: string, userId: string, loginUsername: string) => {
    return await prisma.parent.update({
        where: { id: parentId },
        data: { userId, loginUsername },
    });
};

const unlinkUser = async (id: string) => {
    return await prisma.parent.update({
        where: { id },
        data: { userId: null, loginUsername: null },
    });
};

export { listParents, getParentById, createParent, linkUserToParent, updateParent, softDeleteParent, linkedUserIds, unlinkUser };

