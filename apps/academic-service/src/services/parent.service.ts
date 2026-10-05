import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Prisma } from "../../prisma/generated";
import { CreateParentDto } from "../dtos/parent/CreateParentDto";
import { UpdateParentDto } from "../dtos/parent/UpdateParentDto";
import {
    EmailTakenError, ParentNotFoundError, UnableToDetermineCountryError, UserAlreadyLinkedError,
} from "../errors/AppError";
import * as parentRepo from "../repositories/parent.repository";

type Actor = { sub: string, username: string };

const phoneCountryOf = (phone: string): string => {
    const parsed = parsePhoneNumberFromString(phone);
    if (!parsed?.country) throw new UnableToDetermineCountryError();

    return parsed.country;
};

const listParents = async (page: number, pageSize: number) =>
    await parentRepo.listParents((page - 1) * pageSize, pageSize);

const getParentById = async (id: string) => await parentRepo.getParentById(id);

const createParent = async (dto: CreateParentDto, actor: Actor) => {
    const phoneCountry = phoneCountryOf(dto.phone);

    try {
        return await parentRepo.createParent({
            ...dto,
            phoneCountry,
            createdByUserId: actor.sub,
            createdByUsername: actor.username,
        });
    } catch (error) {
        // Parent.email is @unique — two admins adding the same guardian land here.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new EmailTakenError();
        }
        throw error;
    }
};

const updateParent = async (id: string, dto: UpdateParentDto) => {
    const record = await parentRepo.getParentById(id);
    if (!record) throw new ParentNotFoundError();

    const phoneCountry = phoneCountryOf(dto.phone);

    try {
        return await parentRepo.updateParent(id, { ...dto, phoneCountry });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new EmailTakenError();
        }
        throw error;
    }
};

const deleteParent = async (id: string) => {
    const record = await parentRepo.getParentById(id);
    if (!record) throw new ParentNotFoundError();

    return await parentRepo.softDeleteParent(id);
};

const linkUserToParent = async (parentId: string, userId: string, loginUsername: string) => {
    const record = await parentRepo.getParentById(parentId);
    if (!record) throw new ParentNotFoundError();

    try {
        return await parentRepo.linkUserToParent(parentId, userId, loginUsername);
    } catch (error) {
        // Parent.userId is @unique — the client-side filter is UX, this is the
        // guarantee. Two admins picking the same account land here.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new UserAlreadyLinkedError();
        }
        throw error;
    }
};

const linkedUserIds = async () => await parentRepo.linkedUserIds();

const unlinkUser = async (id: string) => {
    const record = await parentRepo.getParentById(id);
    if (!record) throw new ParentNotFoundError();

    return await parentRepo.unlinkUser(id);
};

export {
    createParent, deleteParent, getParentById, linkedUserIds, linkUserToParent, listParents, unlinkUser, updateParent
};
