import { prisma } from "../lib/prisma";

const findUnpublished = async (take: number) => {
    return await prisma.outboxEvent.findMany({
        where: { publishedAt: null },
        orderBy: { occurredAt: 'asc' },
        take
    });
}

const markPublished = async (id: string) => {
    return await prisma.outboxEvent.update({
        where: { id },
        data: { publishedAt: new Date() }
    });
};

export {
    findUnpublished,
    markPublished
};