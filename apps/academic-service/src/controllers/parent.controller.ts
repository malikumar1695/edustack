import { requireRole } from "@ilm/auth-kit";
import { validateBody } from "@ilm/http-kit";
import { Router } from "express";
import { LinkUserDto } from "../dtos/LinkUserDto";
import { CreateParentDto } from "../dtos/parent/CreateParentDto";
import { UpdateParentDto } from "../dtos/parent/UpdateParentDto";
import * as parentService from "../services/parent.service";

export const parentRouter = Router();

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// Declared before the "/:id" routes so "linked-user-ids" isn't matched as an id.
parentRouter.get("/linked-user-ids", requireRole("admin", "teacher"), async (_req, res) => {
    res.json(await parentService.linkedUserIds());
});

parentRouter.get("/", requireRole("admin", "teacher"), async (req, res) => {
    const page = Math.max(1, Number(req.query.current) || 1);
    const pageSize = Math.min(Number(req.query.pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

    res.json(await parentService.listParents(page, pageSize));
});

parentRouter.post("/", requireRole("admin", "teacher"), validateBody(CreateParentDto), async (req, res) => {
    const dto = req.body as CreateParentDto;

    const parent = await parentService.createParent(dto, req.user!);
    req.log.info({ parentId: parent.id, by: req.user!.sub }, "parent created");
    res.status(201).json(parent);
});

parentRouter.put("/:id", requireRole("admin", "teacher"), validateBody(UpdateParentDto), async (req, res) => {
    const dto = req.body as UpdateParentDto;

    const parent = await parentService.updateParent(req.params.id, dto);
    req.log.info({ parentId: parent.id, by: req.user!.sub }, "parent updated");
    res.json(parent);
});

parentRouter.delete("/:id", requireRole("admin", "teacher"), async (req, res) => {
    await parentService.deleteParent(req.params.id);
    req.log.info({ parentId: req.params.id, by: req.user!.sub }, "parent deleted");
    res.status(204).send();
});

parentRouter.put("/:id/user", requireRole("admin"), validateBody(LinkUserDto), async (req, res) => {
    const { userId, loginUsername } = req.body as LinkUserDto;

    const parent = await parentService.linkUserToParent(req.params.id, userId, loginUsername);
    req.log.info({ parentId: parent.id, userId, by: req.user!.sub }, "user linked to parent");
    res.json(parent);
});

parentRouter.delete("/:id/user", requireRole("admin"), async (req, res) => {
    const parent = await parentService.unlinkUser(req.params.id);
    req.log.info({ parentId: parent.id, by: req.user!.sub }, "parent unlinked from user account");
    res.json(parent);
});
