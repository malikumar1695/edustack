import { requireRole } from "@ilm/auth-kit";
import { validateBody } from "@ilm/http-kit";
import { Router } from "express";
import { AddEnrollmentsDto } from "../dtos/class/AddEnrollmentsDto";
import { CreateClassDto } from "../dtos/class/CreateClassDto";
import { SetEnrollmentsDto } from "../dtos/class/SetEnrollmentsDto";
import { UpdateClassDto } from "../dtos/class/UpdateClassDto";
import * as classService from "../services/class.service";

export const classRouter = Router();

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// Teachers and students can list (scoped in the service to classes they teach
// or are enrolled in). Only admins and teachers see a roster, since it names
// the other students. Only admins change classes; rosters can also be changed
// by the class's own teacher, which the service enforces.
classRouter.get("/", requireRole("admin", "teacher", "student"), async (req, res) => {
    const page = Math.max(1, Number(req.query.current) || 1);
    const pageSize = Math.min(Number(req.query.pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

    res.json(await classService.listClasses(page, pageSize, req.user!));
});

classRouter.get("/:id", requireRole("admin", "teacher"), async (req, res) => {
    res.json(await classService.getClass(req.params.id, req.user!));
});

classRouter.post("/", requireRole("admin"), validateBody(CreateClassDto), async (req, res) => {
    const dto = req.body as CreateClassDto;

    const created = await classService.createClass(dto, req.user!);
    req.log.info({ classId: created.id, teacherUserId: created.teacherUserId, by: req.user!.sub }, "class created");
    res.status(201).json(created);
});

classRouter.put("/:id", requireRole("admin"), validateBody(UpdateClassDto), async (req, res) => {
    const dto = req.body as UpdateClassDto;

    const updated = await classService.updateClass(req.params.id, dto);
    req.log.info({ classId: updated.id, by: req.user!.sub }, "class updated");
    res.json(updated);
});

classRouter.delete("/:id", requireRole("admin"), async (req, res) => {
    await classService.deleteClass(req.params.id);
    req.log.info({ classId: req.params.id, by: req.user!.sub }, "class deleted");
    res.status(204).send();
});

classRouter.put("/:id/students", requireRole("admin", "teacher"), validateBody(SetEnrollmentsDto), async (req, res) => {
    const { studentIds } = req.body as SetEnrollmentsDto;

    const updated = await classService.setEnrollments(req.params.id, studentIds, req.user!);
    req.log.info({ classId: updated.id, studentCount: studentIds.length, by: req.user!.sub }, "class roster updated");
    res.json(updated);
});

classRouter.post("/:id/students", requireRole("admin", "teacher"), validateBody(AddEnrollmentsDto), async (req, res) => {
    const { studentIds } = req.body as AddEnrollmentsDto;

    await classService.addEnrollments(req.params.id, studentIds, req.user!);
    req.log.info({ classId: req.params.id, studentCount: studentIds.length, by: req.user!.sub }, "students added to class");
    res.status(204).send();
});

classRouter.delete("/:id/students/:studentId", requireRole("admin", "teacher"), async (req, res) => {
    const { id, studentId } = req.params;

    await classService.removeEnrollment(id, studentId, req.user!);
    req.log.info({ classId: id, studentId, by: req.user!.sub }, "student removed from class");
    res.status(204).send();
});
